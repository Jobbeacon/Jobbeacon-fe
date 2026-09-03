# Cấu trúc dự án JobBeacon Frontend

## 1. Mục đích tài liệu

Tài liệu này mô tả cấu trúc mã nguồn frontend của JobBeacon và quy định vị trí triển khai cho từng loại code. Mục tiêu là giúp thành viên mới có thể xác định đúng file cần sửa, tái sử dụng phần đã có và tránh tạo thêm file, component, type hoặc service trùng chức năng.

Frontend được tổ chức theo hướng **feature-based**: code thuộc cùng một nghiệp vụ được đặt trong cùng một feature. Code không phụ thuộc nghiệp vụ và được dùng ở nhiều nơi mới được đặt trong `shared`.

> Trạng thái hiện tại: các file trong `src` mới là placeholder cho phase dựng base, chưa chứa logic triển khai.

## 2. Nguyên tắc phụ thuộc

Luồng phụ thuộc tổng quát:

```text
main.tsx
   └── app
       ├── features
       │   └── shared
       └── shared
```

- `main.tsx` chỉ khởi động React và render ứng dụng.
- `app` lắp ghép toàn ứng dụng: provider, router, guard, layout và cấu hình cấp ứng dụng.
- `features` chứa code theo nghiệp vụ cụ thể.
- `shared` chứa code dùng chung, không được chứa quy tắc nghiệp vụ của một feature cụ thể.
- Một feature có thể tái sử dụng type/component do feature khác sở hữu khi thực sự cần, nhưng không được sao chép chúng để tránh import chéo.
- `shared` không được import ngược từ `features` hoặc `app`.
- Không đưa API call, state nghiệp vụ hoặc xử lý dữ liệu vào component UI dùng chung.

## 3. Cây thư mục tổng thể

```text
Jobbeacon-fe/
├── .env                                   # Cấu hình môi trường cục bộ; không lưu secret vào Git
├── .gitignore                             # Danh sách file/thư mục Git không theo dõi
├── docs/
│   ├── ke-hoach-do-an-tot-nghiep (1).md  # Phạm vi và kế hoạch nghiệp vụ của đồ án
│   └── cau-truc-du-an-frontend.md         # Tài liệu cấu trúc đang đọc
├── public/                                # Tài nguyên tĩnh được phục vụ nguyên trạng
│   ├── favicon.svg                        # Biểu tượng tab trình duyệt
│   └── icons.svg                          # SVG sprite/tập icon public nếu ứng dụng sử dụng
├── src/                                   # Toàn bộ mã nguồn frontend
│   ├── app/                               # Cấu hình và thành phần ghép nối cấp ứng dụng
│   ├── assets/                            # Ảnh, SVG và tài nguyên được import từ code
│   │   ├── hero.png                       # Tài nguyên ảnh hiện có; thay/xóa khi thiết kế được chốt
│   │   ├── react.svg                      # Tài nguyên từ Vite starter, không dùng cho nghiệp vụ
│   │   └── vite.svg                       # Tài nguyên từ Vite starter, không dùng cho nghiệp vụ
│   ├── features/                          # Các module nghiệp vụ độc lập
│   ├── shared/                            # Thành phần kỹ thuật dùng chung
│   ├── test/                              # Thiết lập và hạ tầng test dùng chung
│   └── main.tsx                           # Điểm khởi động duy nhất của ứng dụng
├── index.html                             # HTML shell để Vite mount ứng dụng React
├── package.json                           # Dependencies và các npm script
├── package-lock.json                      # Khóa chính xác phiên bản dependency của npm
├── README.md                              # Hướng dẫn cài đặt và chạy dự án
├── eslint.config.js                       # Quy tắc kiểm tra chất lượng code
├── tsconfig.json                          # TypeScript project references
├── tsconfig.app.json                      # TypeScript config cho source frontend
├── tsconfig.node.json                     # TypeScript config cho Vite/Node tooling
└── vite.config.ts                         # Cấu hình bundler và plugin Vite
```

Không chỉnh sửa trực tiếp `node_modules` hoặc `dist`. Hai thư mục này lần lượt là dependency đã cài và kết quả được sinh ra khi build.

## 4. Thư mục `src/app`

`app` chỉ chịu trách nhiệm lắp ghép ứng dụng. Không đặt API endpoint, business type, form nghiệp vụ hoặc logic của một feature vào đây.

```text
src/app/
├── App.tsx
├── config/
│   ├── env.ts
│   ├── navigation.ts
│   └── roles.ts
├── layouts/
│   ├── AdminLayout.tsx
│   ├── AuthLayout.tsx
│   └── UserLayout.tsx
├── providers/
│   └── AppProviders.tsx
├── router/
│   ├── guards/
│   │   ├── AdminGuard.tsx
│   │   └── AuthGuard.tsx
│   ├── AppRouter.tsx
│   └── route-paths.ts
└── styles/
    ├── globals.css
    └── theme.css
```

### Chức năng từng file

- `App.tsx`: component gốc; chỉ ghép `AppProviders` với `AppRouter` và các thành phần toàn cục. Không viết nội dung của từng trang tại đây.
- `config/env.ts`: đọc, kiểm tra và cung cấp biến môi trường cho ứng dụng. Mọi nơi cần base URL hoặc cấu hình môi trường phải dùng file này thay vì đọc `import.meta.env` rải rác.
- `config/navigation.ts`: định nghĩa dữ liệu menu/navigation dùng bởi layout. Không đặt JSX của menu trong file này.
- `config/roles.ts`: hằng số và quy ước role như User/Admin. Type role phục vụ toàn ứng dụng cũng được quản lý tại đây nếu không thuộc riêng auth.
- `layouts/AdminLayout.tsx`: khung giao diện Admin Site, ví dụ sidebar, header và vùng render route con.
- `layouts/AuthLayout.tsx`: khung dùng chung cho các trang đăng nhập, đăng ký và quên mật khẩu.
- `layouts/UserLayout.tsx`: khung giao diện User Site, ví dụ header, navigation, footer và vùng nội dung.
- `providers/AppProviders.tsx`: nơi đăng ký các provider toàn ứng dụng như router context, query client, auth, theme hoặc notification. Không tạo nhiều file provider nếu provider chỉ có vài dòng và không cần quản lý riêng.
- `router/AppRouter.tsx`: khai báo cây route, gắn page vào layout và guard tương ứng. Page phải được import từ `features`, không viết page JSX trực tiếp tại đây.
- `router/route-paths.ts`: nguồn duy nhất chứa route path/name để tránh hard-code URL ở nhiều component.
- `router/guards/AuthGuard.tsx`: kiểm tra người dùng đã đăng nhập trước khi vào route được bảo vệ.
- `router/guards/AdminGuard.tsx`: kiểm tra quyền Admin. Không lặp lại kiểm tra role tại từng admin page.
- `styles/globals.css`: reset, base style và quy tắc CSS áp dụng toàn hệ thống.
- `styles/theme.css`: design token toàn cục như màu, font, spacing, radius và shadow. Style riêng của component không đặt tại đây.

## 5. Thư mục `src/features`

Mỗi thư mục con là một module nghiệp vụ. Cấu trúc con thống nhất:

```text
feature-name/
├── api/          # Hàm gọi API của feature
├── components/   # Component chỉ dùng trong feature
├── hooks/        # Logic React và điều phối dữ liệu của feature
├── pages/        # Component cấp màn hình, được router sử dụng
├── schemas/      # Validation schema nếu feature có form/input phức tạp
├── store/        # Client state dùng chung trong feature nếu thật sự cần
└── types/        # Business type thuộc quyền sở hữu của feature
```

Không phải feature nào cũng cần đủ tất cả thư mục trên. Chỉ tạo thêm thư mục/file khi phát sinh đúng trách nhiệm tương ứng.

### 5.1. `auth` — Xác thực người dùng

```text
features/auth/
├── api/auth.api.ts
├── components/
│   ├── ForgotPasswordForm.tsx
│   ├── LoginForm.tsx
│   └── RegisterForm.tsx
├── hooks/useAuth.ts
├── pages/
│   ├── ForgotPasswordPage.tsx
│   ├── LoginPage.tsx
│   └── RegisterPage.tsx
├── schemas/auth.schema.ts
├── store/auth.store.ts
└── types/auth.types.ts
```

- `auth.api.ts`: request đăng nhập, đăng ký, đăng xuất, refresh token và khôi phục mật khẩu.
- Các file `*Form.tsx`: field, validation display và thao tác submit của đúng form được đặt tên.
- `useAuth.ts`: cung cấp thao tác và trạng thái xác thực cho React component; gọi `auth.api.ts` thay vì gọi HTTP trực tiếp.
- Các file `*Page.tsx`: ghép form với layout/content cấp trang; không lặp lại logic đã có trong form/hook.
- `auth.schema.ts`: schema kiểm tra dữ liệu của toàn bộ form xác thực.
- `auth.store.ts`: trạng thái phiên đăng nhập cần chia sẻ toàn ứng dụng. Không lưu server state danh sách ở đây.
- `auth.types.ts`: type cho user session, credential, token payload và request/response xác thực.

### 5.2. `candidate-profile` — Hồ sơ số hóa của ứng viên

```text
features/candidate-profile/
├── api/candidate-profile.api.ts
├── components/ProfileForm.tsx
├── hooks/useCandidateProfile.ts
├── pages/CandidateProfilePage.tsx
├── schemas/candidate-profile.schema.ts
└── types/candidate-profile.types.ts
```

- `candidate-profile.api.ts`: đọc và cập nhật hồ sơ ứng viên đã số hóa.
- `ProfileForm.tsx`: form chỉnh sửa thông tin cá nhân, kỹ năng, kinh nghiệm và học vấn.
- `useCandidateProfile.ts`: truy vấn/cập nhật hồ sơ và điều phối trạng thái liên quan.
- `CandidateProfilePage.tsx`: màn hình quản lý hồ sơ ứng viên.
- `candidate-profile.schema.ts`: validation cho dữ liệu hồ sơ.
- `candidate-profile.types.ts`: type của hồ sơ, kỹ năng, kinh nghiệm và học vấn.

Phân biệt với `cv`: `candidate-profile` quản lý dữ liệu hồ sơ có cấu trúc; `cv` quản lý file CV, upload và kết quả trích xuất. Không đưa upload file CV vào `ProfileForm.tsx`.

### 5.3. `jobs` — Tìm kiếm và xem việc làm

```text
features/jobs/
├── api/jobs.api.ts
├── components/
│   ├── JobCard.tsx
│   ├── JobFilters.tsx
│   ├── JobList.tsx
│   └── JobSearchBar.tsx
├── hooks/
│   ├── useJobDetail.ts
│   └── useJobs.ts
├── pages/
│   ├── JobDetailPage.tsx
│   └── JobSearchPage.tsx
└── types/job.types.ts
```

- `jobs.api.ts`: API tìm kiếm, lọc, phân trang và lấy chi tiết việc làm.
- `JobCard.tsx`: hiển thị tóm tắt một việc làm; không tự fetch dữ liệu.
- `JobFilters.tsx`: bộ lọc địa điểm, lương, ngành nghề, cấp bậc và hình thức làm việc.
- `JobList.tsx`: render tập hợp `JobCard` và trạng thái danh sách.
- `JobSearchBar.tsx`: nhập từ khóa tìm kiếm.
- `useJobs.ts`: điều phối search/filter/pagination và dữ liệu danh sách.
- `useJobDetail.ts`: lấy và quản lý dữ liệu một tin việc làm.
- `JobSearchPage.tsx`: màn hình tìm kiếm, ghép search bar, filter và list.
- `JobDetailPage.tsx`: màn hình chi tiết tin tuyển dụng.
- `job.types.ts`: type chuẩn của Job, JobDetail, JobFilter và dữ liệu phân trang liên quan. Các feature saved/recommendations phải tái sử dụng type Job tại đây, không định nghĩa lại.

### 5.4. `saved-jobs` — Việc làm đã lưu

```text
features/saved-jobs/
├── api/saved-jobs.api.ts
├── components/SavedJobList.tsx
├── hooks/useSavedJobs.ts
├── pages/SavedJobsPage.tsx
└── types/saved-job.types.ts
```

- `saved-jobs.api.ts`: lưu, bỏ lưu và lấy danh sách việc làm đã lưu.
- `SavedJobList.tsx`: danh sách chuyên biệt cho trạng thái đã lưu; tái sử dụng `JobCard` nếu giao diện phù hợp.
- `useSavedJobs.ts`: điều phối dữ liệu và mutation lưu/bỏ lưu.
- `SavedJobsPage.tsx`: màn hình quản lý danh sách yêu thích.
- `saved-job.types.ts`: chỉ chứa metadata riêng của hành động lưu, không sao chép model Job.

### 5.5. `cv` — Upload và phân tích CV

```text
features/cv/
├── api/cv.api.ts
├── components/
│   ├── CvProfileSummary.tsx
│   └── CvUpload.tsx
├── hooks/useCv.ts
├── pages/CvManagementPage.tsx
└── types/cv.types.ts
```

- `cv.api.ts`: upload, xóa, tải thông tin và yêu cầu phân tích CV.
- `CvUpload.tsx`: chọn file PDF/DOCX, kiểm tra input phía client và thể hiện tiến trình upload.
- `CvProfileSummary.tsx`: trình bày kỹ năng, kinh nghiệm và học vấn được trích xuất từ CV.
- `useCv.ts`: điều phối upload, trạng thái xử lý và dữ liệu kết quả.
- `CvManagementPage.tsx`: màn hình quản lý CV.
- `cv.types.ts`: type file CV, trạng thái xử lý và kết quả trích xuất.

### 5.6. `recommendations` — Gợi ý việc làm phù hợp

```text
features/recommendations/
├── api/recommendations.api.ts
├── components/
│   ├── JobMatchCard.tsx
│   └── RecommendationList.tsx
├── hooks/useRecommendations.ts
├── pages/RecommendationsPage.tsx
└── types/recommendation.types.ts
```

- `recommendations.api.ts`: lấy danh sách gợi ý và chi tiết điểm phù hợp.
- `JobMatchCard.tsx`: hiển thị Job cùng điểm/lý do phù hợp; tái sử dụng type Job từ feature `jobs`.
- `RecommendationList.tsx`: danh sách các kết quả gợi ý.
- `useRecommendations.ts`: điều phối server state cho gợi ý.
- `RecommendationsPage.tsx`: màn hình việc làm phù hợp với hồ sơ người dùng.
- `recommendation.types.ts`: type điểm matching, lý do matching và metadata đề xuất; không định nghĩa lại Job.

### 5.7. `notifications` — Thông báo trên web

```text
features/notifications/
├── api/notifications.api.ts
├── components/
│   ├── NotificationItem.tsx
│   └── NotificationList.tsx
├── hooks/useNotifications.ts
├── pages/NotificationsPage.tsx
└── types/notification.types.ts
```

- `notifications.api.ts`: lấy, đánh dấu đã đọc và quản lý thông báo.
- `NotificationItem.tsx`: hiển thị một thông báo.
- `NotificationList.tsx`: danh sách và trạng thái rỗng/loading của thông báo.
- `useNotifications.ts`: điều phối danh sách, unread count và thao tác đánh dấu đã đọc.
- `NotificationsPage.tsx`: màn hình toàn bộ thông báo.
- `notification.types.ts`: type notification, loại thông báo và trạng thái đọc.

Email notification là trách nhiệm backend. Frontend chỉ quản lý tùy chọn nhận email nếu sau này có màn hình cài đặt.

### 5.8. `career-chat` — Chatbot tư vấn nghề nghiệp

```text
features/career-chat/
├── api/career-chat.api.ts
├── components/
│   ├── ChatComposer.tsx
│   ├── ChatMessage.tsx
│   └── ChatThread.tsx
├── hooks/useCareerChat.ts
├── pages/CareerChatPage.tsx
└── types/career-chat.types.ts
```

- `career-chat.api.ts`: gửi câu hỏi, lấy lịch sử và làm việc với API chatbot.
- `ChatComposer.tsx`: ô nhập và gửi tin nhắn.
- `ChatMessage.tsx`: hiển thị một message của user hoặc assistant.
- `ChatThread.tsx`: hiển thị chuỗi message; không tự gọi API.
- `useCareerChat.ts`: quản lý phiên chat, streaming/loading/error và điều phối request.
- `CareerChatPage.tsx`: màn hình chatbot hoàn chỉnh.
- `career-chat.types.ts`: type session, role, message và response của chatbot.

### 5.9. `admin-dashboard` — Tổng quan vận hành Admin

```text
features/admin-dashboard/
├── components/CrawlerStatusOverview.tsx
└── pages/AdminDashboardPage.tsx
```

- `CrawlerStatusOverview.tsx`: tổng hợp trạng thái crawler để hiển thị trên dashboard. Dữ liệu chi tiết vẫn thuộc `crawl-sources` và `crawl-runs`.
- `AdminDashboardPage.tsx`: màn hình tổng quan Admin; chỉ ghép các widget, không chứa logic quản lý source hoặc log.

Chỉ tạo API riêng cho dashboard khi backend cung cấp endpoint tổng hợp dành riêng cho dashboard. Không sao chép API từ hai feature crawler.

### 5.10. `crawl-sources` — Quản lý nguồn crawler

```text
features/crawl-sources/
├── api/crawl-sources.api.ts
├── components/
│   ├── CrawlSourceForm.tsx
│   ├── CrawlSourceList.tsx
│   └── CrawlSourceStatus.tsx
├── hooks/useCrawlSources.ts
├── pages/CrawlSourcesPage.tsx
└── types/crawl-source.types.ts
```

- `crawl-sources.api.ts`: lấy nguồn, cập nhật cấu hình và bật/tắt crawler theo nguồn.
- `CrawlSourceForm.tsx`: form cấu hình một nguồn crawl.
- `CrawlSourceList.tsx`: danh sách nguồn dữ liệu.
- `CrawlSourceStatus.tsx`: badge/trạng thái hoạt động của nguồn.
- `useCrawlSources.ts`: điều phối query và mutation của nguồn crawl.
- `CrawlSourcesPage.tsx`: màn hình quản lý nguồn.
- `crawl-source.types.ts`: type cấu hình, trạng thái và thông tin nguồn crawl.

### 5.11. `crawl-runs` — Lịch sử chạy và log crawler

```text
features/crawl-runs/
├── api/crawl-runs.api.ts
├── components/
│   ├── CrawlLogViewer.tsx
│   └── CrawlRunHistory.tsx
├── hooks/useCrawlRuns.ts
├── pages/
│   ├── CrawlRunDetailPage.tsx
│   └── CrawlRunHistoryPage.tsx
└── types/crawl-run.types.ts
```

- `crawl-runs.api.ts`: lấy lịch sử, chi tiết lần chạy và log crawler.
- `CrawlLogViewer.tsx`: trình bày log của một lần chạy.
- `CrawlRunHistory.tsx`: bảng/danh sách các lần chạy.
- `useCrawlRuns.ts`: điều phối filter, pagination và dữ liệu lịch sử.
- `CrawlRunHistoryPage.tsx`: màn hình lịch sử tổng thể.
- `CrawlRunDetailPage.tsx`: màn hình chi tiết và log của một lần chạy.
- `crawl-run.types.ts`: type lần chạy, kết quả, trạng thái và log entry.

Phân biệt với `crawl-sources`: source là cấu hình lâu dài của nơi thu thập; run là một lần thực thi và log phát sinh. Không gộp hai model này vào cùng một type/file.

## 6. Thư mục `src/shared`

Chỉ đưa code vào `shared` khi nó không mang ý nghĩa nghiệp vụ riêng và có khả năng được dùng bởi ít nhất hai feature. Nếu component chỉ phục vụ một feature, giữ nó trong feature đó.

```text
src/shared/
├── api/
│   ├── api-client.ts
│   └── api-endpoints.ts
├── components/
│   ├── common/
│   │   ├── EmptyState.tsx
│   │   ├── ErrorState.tsx
│   │   └── LoadingState.tsx
│   ├── navigation/
│   │   ├── AdminSidebar.tsx
│   │   ├── Header.tsx
│   │   └── UserNavigation.tsx
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       ├── Pagination.tsx
│       └── Select.tsx
├── constants/app.constants.ts
├── hooks/
│   ├── useDebounce.ts
│   └── usePagination.ts
├── lib/query-client.ts
├── services/file-upload.service.ts
├── types/
│   ├── api.types.ts
│   └── common.types.ts
└── utils/
    ├── date.ts
    ├── format.ts
    └── storage.ts
```

### Chức năng từng phần

- `api/api-client.ts`: cấu hình HTTP client, base URL, header xác thực, interceptor và chuẩn hóa lỗi dùng chung. Feature API phải gọi qua client này.
- `api/api-endpoints.ts`: endpoint path dùng chung hoặc quy ước tạo URL. Endpoint chỉ thuộc một feature nên ưu tiên giữ trong file API của feature đó.
- `components/common/EmptyState.tsx`: trạng thái không có dữ liệu dùng chung.
- `components/common/ErrorState.tsx`: trạng thái lỗi dùng chung và hành động retry nếu có.
- `components/common/LoadingState.tsx`: trạng thái loading dùng chung.
- `components/navigation/AdminSidebar.tsx`: navigation hiển thị trong `AdminLayout`.
- `components/navigation/Header.tsx`: header dùng chung cho layout; không chứa logic riêng của một trang.
- `components/navigation/UserNavigation.tsx`: navigation của User Site.
- `components/ui/Button.tsx`: primitive button chuẩn của hệ thống.
- `components/ui/Input.tsx`: primitive input chuẩn; không gắn validation của một nghiệp vụ cụ thể.
- `components/ui/Modal.tsx`: primitive dialog/modal dùng chung.
- `components/ui/Pagination.tsx`: điều khiển phân trang thuần UI.
- `components/ui/Select.tsx`: primitive select dùng chung.
- `constants/app.constants.ts`: hằng số thật sự dùng toàn ứng dụng. Hằng số riêng feature phải nằm trong feature.
- `hooks/useDebounce.ts`: hook debounce tổng quát, thường được search sử dụng.
- `hooks/usePagination.ts`: trạng thái phân trang phía client không phụ thuộc nghiệp vụ.
- `lib/query-client.ts`: cấu hình thư viện quản lý server state/cache nếu dự án chọn sử dụng.
- `services/file-upload.service.ts`: cơ chế upload file tổng quát. Kiểm tra định dạng CV và nghiệp vụ CV vẫn nằm trong feature `cv`.
- `types/api.types.ts`: kiểu response/error/pagination chung của backend.
- `types/common.types.ts`: kiểu kỹ thuật dùng chung, không đặt Job, CV, User Profile hoặc crawler model vào đây.
- `utils/date.ts`: parse/format ngày giờ thuần, không chứa JSX hoặc state.
- `utils/format.ts`: formatter tổng quát như số, tiền tệ và text.
- `utils/storage.ts`: wrapper cho local/session storage. Feature không truy cập storage trực tiếp nếu thao tác đó đã được chuẩn hóa tại đây.

## 7. Thư mục tài nguyên và test

```text
src/
├── assets/                  # Tài nguyên được bundler quản lý
└── test/
    ├── mocks/handlers.ts    # Mock API handlers dùng chung
    └── setup.ts             # Thiết lập test environment toàn cục
```

- `assets`: đặt hình ảnh, font hoặc SVG được import trong TypeScript/CSS. Tài nguyên cần URL cố định và phục vụ nguyên trạng đặt trong `public`.
- `test/setup.ts`: đăng ký matcher, cleanup, polyfill hoặc cấu hình test global. Không viết test case tại đây.
- `test/mocks/handlers.ts`: handler giả lập API dùng lại giữa nhiều test. Mock chỉ của một feature nên đặt cạnh test của feature đó khi test được bổ sung.

Khi bắt đầu viết test, ưu tiên đặt test cạnh file được kiểm tra, ví dụ `JobCard.test.tsx` cạnh `JobCard.tsx`. Không tạo một cây `tests` khác sao chép toàn bộ cấu trúc `src`.

## 8. Code nên đặt ở đâu?

| Nhu cầu | Vị trí đúng | Không nên đặt ở |
| --- | --- | --- |
| Thêm route mới | `app/router/AppRouter.tsx` và `route-paths.ts` | `main.tsx`, component navigation |
| Thêm màn hình nghiệp vụ | `features/<feature>/pages` | `app`, `shared/components` |
| Gọi endpoint nghiệp vụ | `features/<feature>/api/*.api.ts` | page hoặc component UI |
| Cấu hình HTTP chung | `shared/api/api-client.ts` | từng file API feature |
| State/query logic nghiệp vụ | `features/<feature>/hooks` | component UI thuần |
| Global client state | Store của feature sở hữu state | `App.tsx`, biến global rời rạc |
| Type của Job/CV/Crawler | `types` của feature tương ứng | `shared/types/common.types.ts` |
| API response/pagination chung | `shared/types/api.types.ts` | lặp lại trong từng feature |
| Validation form | `schemas` của feature | component UI dùng chung |
| Component chỉ dùng trong một feature | `features/<feature>/components` | `shared/components` |
| UI primitive dùng nhiều feature | `shared/components/ui` | sao chép trong từng feature |
| Loading/error/empty state chung | `shared/components/common` | tạo biến thể giống nhau ở mỗi page |
| Menu và khung trang | `app/layouts`, `shared/components/navigation` | từng page nghiệp vụ |
| Biến môi trường | `app/config/env.ts` | truy cập trực tiếp rải rác |
| Format ngày, số, tiền tệ | `shared/utils` | component hoặc hook nghiệp vụ |

## 9. Quy tắc tránh tạo code dư thừa

Trước khi tạo file mới, người code phải thực hiện các bước sau:

1. Tìm theo tên và trách nhiệm trong `src`, không chỉ tìm đúng tên file dự định tạo.
2. Xác định code là cấp ứng dụng, nghiệp vụ hay dùng chung để chọn `app`, `features` hoặc `shared`.
3. Kiểm tra feature hiện tại đã có file đúng layer chưa. Nếu có, bổ sung vào file đó trước khi tạo file cùng loại.
4. Tái sử dụng business type từ feature sở hữu dữ liệu. Không tạo lại `Job`, `CandidateProfile`, `Cv` hoặc crawler status dưới tên khác.
5. Tái sử dụng primitive trong `shared/components/ui` trước khi tạo button, input, modal, select hoặc pagination mới.
6. Chỉ đưa component vào `shared` khi component không chứa nghiệp vụ và thực sự có nhiều nơi dùng.
7. Không tạo file `index.ts` chỉ để re-export nếu chưa có nhu cầu public API rõ ràng; import trực tiếp giúp truy vết quyền sở hữu dễ hơn.
8. Không tạo các thư mục chung chung như `helpers`, `misc`, `common2`, `new-components` hoặc `services` ở root.
9. Không đặt nhiều trách nhiệm vào page. Khi logic đủ lớn hoặc được tái sử dụng, chuyển đúng phần sang hook/component hiện có.
10. Nếu một chức năng mới không khớp feature nào, chỉ tạo feature mới khi đó là một miền nghiệp vụ độc lập, có page/API/state hoặc vòng đời riêng.

### Khi nào hợp lý để tạo file mới?

- Có một màn hình mới được router truy cập độc lập.
- Có một component có trách nhiệm riêng, đủ lớn hoặc được tái sử dụng.
- Có một hook đóng gói logic React/query được dùng nhiều nơi hoặc giúp page/component giữ đúng trách nhiệm.
- Có một business type/schema lớn thuộc một miền mới và không trùng model hiện có.
- Backend bổ sung nhóm API mới có vòng đời độc lập với API đang có.

### Khi nào không nên tạo file mới?

- Chỉ để chứa một hằng số đang dùng tại đúng một file.
- Chỉ đổi tên hoặc bọc lại một component đã có mà không thêm hành vi thực sự.
- Tạo một API service thứ hai cho cùng feature.
- Tạo type response mới có cấu trúc giống type hiện có.
- Tạo component `Button`, `Input`, loading hoặc pagination riêng cho từng page.
- Tách file quá sớm khi logic vẫn nhỏ, chỉ dùng một lần và thuộc rõ trách nhiệm của file hiện tại.

## 10. Quy ước đặt tên

- Component và page: `PascalCase.tsx`, ví dụ `JobCard.tsx`.
- Hook: `camelCase` bắt đầu bằng `use`, ví dụ `useJobs.ts`.
- API: `<feature>.api.ts`.
- Type: `<feature>.types.ts`.
- Validation: `<feature>.schema.ts`.
- Store: `<feature>.store.ts`.
- Utility: tên hành vi ngắn gọn dạng `camelCase`, ví dụ `format.ts`.
- Tên feature/thư mục: `kebab-case`, ví dụ `saved-jobs` và `career-chat`.
- Mỗi file nên có một trách nhiệm chính; tên file phải thể hiện được trách nhiệm đó.

## 11. Luồng triển khai một chức năng

Ví dụ khi triển khai tìm kiếm việc làm:

1. Khai báo model và filter trong `features/jobs/types/job.types.ts`.
2. Khai báo request trong `features/jobs/api/jobs.api.ts`, sử dụng `shared/api/api-client.ts`.
3. Điều phối query/filter/pagination trong `features/jobs/hooks/useJobs.ts`.
4. Hiển thị input tại `JobSearchBar.tsx`, bộ lọc tại `JobFilters.tsx` và kết quả tại `JobList.tsx`/`JobCard.tsx`.
5. Ghép các phần trong `JobSearchPage.tsx`.
6. Đăng ký page tại `app/router/AppRouter.tsx` và dùng path từ `app/router/route-paths.ts`.

Luồng này cũng áp dụng cho các feature khác theo thứ tự: **types → API → hook/store → component → page → router**. Không phải chức năng nào cũng cần đủ mọi bước; chỉ dùng layer thực sự cần thiết.

## 12. Checklist trước khi hoàn thành code

- Code đã nằm đúng feature và đúng layer chưa?
- Đã tìm và tái sử dụng file/component/type hiện có chưa?
- Component có đang gọi HTTP trực tiếp thay vì qua API/hook không?
- Page có chứa logic có thể đặt vào hook hiện có không?
- Có business type nào bị định nghĩa trùng ở nhiều feature không?
- Code trong `shared` có thực sự độc lập với nghiệp vụ không?
- Route path, endpoint hoặc biến môi trường có bị hard-code rải rác không?
- File mới có trách nhiệm rõ ràng và tên đúng convention không?
- `npm run lint` và `npm run build` có chạy thành công không?
