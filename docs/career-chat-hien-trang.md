# JobBeacon Agent (Career Chat) — Hiện trạng code frontend

> Cập nhật: 2026-10-28 · Nhánh: `feat/chat-bot`
> Nguồn: commit `4c709dc` (feat: ui agent chat), `35cddad` (fix: dont show popup when leave page) và task `.work/2026-10-chat-stream-fe` (chat streaming SSE, chưa commit).

## 1. Tổng quan

Tính năng chatbot được đặt tên hiển thị là **JobBeacon Agent** — trợ lý AI giúp ứng viên tìm việc theo kỹ năng, địa điểm, mức lương. Phía frontend hiện đã có:

- Trang chat tại route `/agent`, có link trên Header.
- Gửi tin nhắn qua **SSE** (`POST /api/v1/chat/stream`): câu trả lời Markdown hiện dần, có dòng trạng thái khi agent gọi tool (vd. "Đang tìm việc: Java · Hồ Chí Minh").
- Dừng câu trả lời giữa chừng (nút **Dừng**), tin lỗi có nút **Gửi lại**.
- Reset hội thoại / xóa session trên server (`DELETE /api/v1/chat`).
- Chặn rời trang khi đang có hội thoại (hộp thoại xác nhận + `beforeunload`).
- Yêu cầu đăng nhập mới chat được.

Lịch sử hội thoại **được backend lưu theo user (Redis)**; frontend chỉ gửi tin nhắn mới nhất, còn danh sách tin nhắn hiển thị chỉ nằm trong state React (mất khi reload).

## 2. Cấu trúc thư mục

```
src/features/career-chat/
├── api/
│   ├── career-chat.api.ts          # Gọi API chat (stream + REST), map DTO snake_case -> model
│   └── sse.ts                      # Parser text/event-stream trên fetch ReadableStream
├── components/
│   ├── CareerChat.module.css       # Toàn bộ style của tính năng (~530 dòng)
│   ├── ChatComposer.tsx            # Ô nhập tin nhắn + nút gửi
│   ├── ChatMessage.tsx             # Bong bóng tin nhắn: streaming / lỗi / đã dừng
│   ├── ChatThread.tsx              # Danh sách tin nhắn, auto-scroll bám đáy
│   └── LeaveChatDialog.tsx         # Dialog xác nhận (dùng cho rời trang & reset)
├── hooks/
│   ├── useCareerChat.ts            # State hội thoại, stream/dừng/gửi lại/reset/rời
│   └── useLeaveChatGuard.ts        # Chặn điều hướng khi đang chat
├── pages/
│   └── CareerChatPage.tsx          # Trang /agent
└── types/
    └── career-chat.types.ts        # ChatMessage, AgentReply, AgentToolCall
```

Các file ngoài feature bị ảnh hưởng:

| File | Thay đổi |
|---|---|
| `src/app/App.tsx` | Chuyển từ `BrowserRouter` sang **data router** (`createBrowserRouter`) để dùng được `useBlocker`; thêm route `/agent` trong `MainLayout showFooter={false}` |
| `src/app/layouts/MainLayout.tsx` | Thêm prop `showFooter` (trang chat ẩn footer) |
| `src/shared/components/navigation/header/Header.tsx` | Thêm mục nav "JobBeacon Agent" (`/agent`, icon `Bot`) |
| `package.json` | Thêm `react-markdown@^10.1.0`, `remark-gfm@^4.0.1` |
| `src/shared/api/api-client.ts` | Thêm `authorizedFetch()` (trả `Response` thô, gắn token, retry 401) và `createApiErrorFromResponse()` |
| `nginx.conf` | Thêm `location = /api/v1/chat/stream` (và `/api/api/v1/chat/stream`) tắt `proxy_buffering`, `gzip`, `proxy_read_timeout 120s` |

## 3. Types

`src/features/career-chat/types/career-chat.types.ts`

```ts
type ChatRole = 'user' | 'assistant'
type ChatMessageStatus = 'streaming' | 'done' | 'error' | 'stopped'

type ChatMessage = {
  id: string
  role: ChatRole
  content: string               // Markdown đã nhận (kể cả khi lỗi/dừng giữa chừng)
  isError?: boolean
  status?: ChatMessageStatus    // chỉ tin assistant
  activity?: string             // mô tả tool đang chạy
  toolCalls?: AgentToolCall[]   // từ event done (args = {})
  retryOf?: string              // nội dung user để gửi lại khi lỗi
  errorMessage?: string         // thông báo lỗi hiển thị riêng
}

type AgentToolCall = { name: string; args: Record<string, unknown>; success: boolean }
type AgentToolCallEvent = { name: string; args: Record<string, unknown> }  // event tool_call
type AgentReply = { reply: string; toolCalls: AgentToolCall[] }
```

## 4. API

`src/features/career-chat/api/career-chat.api.ts`.

| Hàm | Method & endpoint | Body | Trả về |
|---|---|---|---|
| `streamAgentMessage(message, { signal, onToolCall, onDelta })` | `POST /api/v1/chat/stream` (`Accept: text/event-stream`) | `{ message }` | `{ toolCalls }` khi nhận `done` |
| `sendAgentMessage(message)` | `POST /api/v1/chat` | `{ message }` | `AgentReply` (giữ lại, UI không còn dùng) |
| `clearAgentSession()` | `DELETE /api/v1/chat` | — | `void` |

### Luồng stream

- Gọi qua `authorizedFetch` (không dùng `EventSource` vì cần header `Authorization` và method POST). Lỗi trước khi mở stream (401/400…) là JSON `ResponseGeneral<Error>` → `ApiError` như các API khác.
- `sse.ts` → `readSseEvents(body, signal)`: `TextDecoder` (stream), chuẩn hoá `\r\n`, tách event theo dòng trống, gộp nhiều dòng `data:` bằng `\n`, bỏ comment `:`.
- Event backend:

| Event | data | Xử lý FE |
|---|---|---|
| `tool_call` | `{name, args}` | `onToolCall` → dòng trạng thái |
| `delta` | `{text}` | `onDelta` → nối vào câu trả lời |
| `done` | `{tool_calls: [{name, success}]}` | resolve `{ toolCalls }` |
| `error` | `{message}` | ném `ApiError(message, 200)`; BE không lưu lượt này |

- Stream đóng mà không có `done`/`error`, hoặc lỗi mạng → `ApiError('Kết nối bị gián đoạn. Vui lòng thử lại.', 0)`.
- Huỷ qua `signal` → ném `DOMException` `AbortError`; BE dừng lượt và không lưu.
- Kết thúc sớm (nhận `done`/`error`, data hỏng, abort) → `readSseEvents` gọi `reader.cancel()` để đóng kết nối. Response 401 đầu tiên được huỷ body trước khi retry với token mới.

## 5. Hooks

### `useCareerChat()`

Trả về `{ messages, isStreaming, sendMessage, stop, retry, resetConversation, leaveConversation }`.

- **Khi mount**: gọi `clearAgentSession()` → mỗi lần vào trang là một hội thoại mới trên server (lỗi bị nuốt). **Unmount**: abort request đang chạy.
- **`sendMessage(content)`**: trim, bỏ qua nếu rỗng hoặc đang stream; thêm tin `user` + tin `assistant` rỗng `status: 'streaming'`, tạo `AbortController`, gọi `streamAgentMessage`.
  - `delta` gom vào buffer, flush vào state mỗi `requestAnimationFrame`; có text thì xoá `activity`.
  - `tool_call` → `activity` tiếng Việt: `search_jobs` → "Đang tìm việc: <keywords · skills · tỉnh · ngành · loại hình · lương>", `get_job_detail` → "Đang xem chi tiết tin tuyển dụng…".
  - Kết thúc: `done` → `status: 'done'`; lỗi → `status: 'error'`, giữ text đã nhận, `errorMessage` (message BE hoặc fallback), `retryOf`; bấm Dừng → `status: 'stopped'`.
  - Mỗi request có id; reset/rời/unmount tăng id nên mọi callback đến muộn bị bỏ qua.
- **`stop()`**: abort request hiện tại. Nút Dừng bỏ qua click trong 400ms đầu sau khi bắt đầu stream (tránh double-click Gửi trúng Dừng).
- **`retry(messageId)`**: xoá cặp tin user + assistant lỗi (BE không lưu lượt lỗi) rồi gửi lại `retryOf`. Nút "Gửi lại" bị disable khi đang có tin khác stream.
- **Lưu ý**: tin "Đã dừng" hoặc lỗi (kể cả phần text đã nhận) vẫn hiện trong UI, nhưng BE **không lưu** lượt đó vào lịch sử → model không nhớ câu hỏi/câu trả lời dở đó ở các lượt sau.
- **`resetConversation()`**: abort (nếu đang stream), xoá state, gọi `clearAgentSession()` (BE đảm bảo lượt đang chạy dở không ghi đè lại, nên không cần chờ).
- **`leaveConversation()`**: abort rồi `clearAgentSession()`, dùng khi người dùng xác nhận rời trang.
### `useLeaveChatGuard({ enabled, onConfirmLeave })`

- Dùng `useBlocker` của react-router: chặn điều hướng **trong app** khi `enabled` và pathname thay đổi.
- Đăng ký `beforeunload` khi `enabled` → reload / đóng tab / gõ URL sẽ hiện hộp thoại mặc định của trình duyệt (không xóa được session trong trường hợp này).
- Trả về `{ isConfirmOpen, isLeaving, confirmLeave, cancelLeave }`; `confirmLeave` chạy `onConfirmLeave` rồi `blocker.proceed()` (kể cả khi lỗi).

## 6. Components

| Component | Mô tả |
|---|---|
| `ChatComposer` | `textarea` tự giãn chiều cao (tối đa 200px), `Enter` gửi, `Shift+Enter` xuống dòng, bỏ qua khi đang gõ IME (`isComposing`). Nút gửi icon `ArrowUp`; khi `isStreaming` thành nút **Dừng** (icon `Square`) gọi `onStop`, textarea vẫn gõ được. Có dòng cảnh báo "JobBeacon Agent có thể mắc lỗi…". |
| `ChatMessage` | `memo`. Tin user: bong bóng text thuần. Tin assistant: avatar `Bot` + Markdown (`react-markdown` + `remark-gfm`). Link nội bộ (`/jobs/<id>`…) render bằng `<Link>`, link ngoài mở tab mới. `streaming`: chưa có text → dòng `activity` (icon xoay) hoặc 3 chấm; có text → con trỏ nhấp nháy cuối đoạn. `error`: text đã nhận + khối lỗi + nút **Gửi lại**. `stopped`: nhãn "Đã dừng". |
| `ChatThread` | Map tin nhắn theo `id`. Auto-scroll mỗi khi `messages` đổi (kể cả nội dung tin cuối); tin mới luôn kéo xuống, còn khi user đã cuộn lên thì không kéo nữa cho tới khi cuộn về gần đáy. |
| `LeaveChatDialog` | Dialog `role="alertdialog"` tái sử dụng được (title/description/confirmLabel tùy chỉnh). Focus nút "Ở lại" khi mở, `Escape` / click backdrop để hủy (bị khóa khi đang xử lý). |

## 7. Trang `CareerChatPage` (`/agent`)

Luồng hiển thị:

1. `isInitializing` (đang kiểm tra phiên) → `LoadingState`.
2. Chưa đăng nhập → màn hình giới thiệu + nút **Đăng nhập** (`/login`). Route không bọc `AuthGuard`, xử lý ngay trong trang.
3. Đã đăng nhập → `<AgentChat key={user.uid} />` (đổi user sẽ remount, reset hội thoại).

Trong `AgentChat`:

- **Chưa có tin nhắn**: màn hình chào "Hôm nay mình có thể giúp gì cho bạn?" + 4 gợi ý bấm để gửi ngay:
  - Tìm việc Java Backend ở Hà Nội
  - Việc làm Frontend React lương trên 20 triệu
  - Tuyển Data Analyst tại Hồ Chí Minh
  - Việc làm kế toán không yêu cầu kinh nghiệm
- **Đã có tin nhắn**: `ChatThread` + nút **"Cuộc trò chuyện mới"** (mở dialog xác nhận reset; bấm được cả khi đang stream, sẽ huỷ stream).
- Luôn có `ChatComposer` ở dưới; khi đang stream nút gửi thành nút Dừng, gợi ý bị disable.
- Guard rời trang bật khi `messages.length > 0`.

## 8. Styling

`CareerChat.module.css` (CSS Modules) gồm các nhóm: layout trang/thread, bong bóng tin nhắn, trạng thái stream (`activity`, con trỏ `streamingText`, `errorBlock`, `retryButton`, `stoppedLabel`), style Markdown (heading, list, code, table, blockquote), nút new chat / login, typing animation, màn hình welcome + gợi ý, composer (+ `stopButton`), dialog, và responsive `@media (max-width: 760px)`.

## 9. Những điểm còn thiếu / cần lưu ý

- **`toolCalls` chưa hiển thị**: đã lưu vào tin assistant khi `done` (chỉ có `name`, `success`), UI chưa dùng. Có thể render card job từ kết quả sau này.
- **Không khôi phục lịch sử**: backend có lưu lịch sử trong Redis nhưng frontend luôn `clearAgentSession()` khi mount và không có API lấy lại lịch sử → reload là mất hội thoại.
- **Reload/đóng tab** không xóa session trên server (chỉ có hộp thoại mặc định của trình duyệt); session cũ sẽ bị xóa ở lần mount tiếp theo. Kết nối stream bị trình duyệt đóng nên BE dừng lượt.
- Tin "Đã dừng"/lỗi hiện trong UI nhưng không có trong lịch sử của model (BE không lưu lượt đó); user có thể tưởng agent nhớ nội dung này.
- `LeaveChatDialog` tự cài dialog riêng, trong khi repo đã có `src/shared/components/ui/Modal.tsx` — có thể cân nhắc dùng chung.
- Footer (`HomeFooter.tsx`) có link "Cẩm nang nghề nghiệp" trỏ tới `/career-chat` — route này không tồn tại (rơi vào catch-all về Home), không phải trang `/agent`.
- Chưa có test tự động cho tính năng này (parser SSE mới chỉ được thử bằng script node ngoài repo).
