# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

JobBeacon frontend: React 19 + TypeScript SPA built with Vite, routing with react-router 7 (data router), auth with Firebase Authentication, styling with CSS Modules and `lucide-react` icons. It talks to the JobBeacon backend (`../Jobbeacon-be`, Spring Boot) over REST and SSE. Production runs as an nginx container that serves the build and reverse-proxies `/api/` to the backend.

## Commands

```bash
npm install
npm run dev        # Vite dev server (mode development, reads .env / .env.local)
npm run build      # tsc -b + vite build --mode prod → dist/
npm run lint       # eslint
npm run preview    # serve dist/ locally
npm run dev:admin      # admin site dev server on :5174 (vite.admin.config.ts)
npm run build:admin    # tsc -b + admin build → dist-admin/
npm run preview:admin
docker build -t jobbeacon-fe .                                      # user site
docker build --build-arg APP_TARGET=admin -t jobbeacon-admin .     # admin site
```

There is no test runner configured (`src/test/` only has a setup file and mocks). "Done" means `npm run lint` and `npm run build` pass (plus `npm run build:admin` when admin code or shared code is touched). `src/features/jobs/components/LocationPicker.tsx` has 2 pre-existing react-refresh lint errors.

## Configuration

- Env vars (see `.env.example`): `VITE_API_BASE_URL` (empty = same origin as the FE), the `VITE_FIREBASE_*` web-app config, and `VITE_USER_SITE_URL` (admin only: base URL of the user site for "view on site" links; empty hides them). Local overrides go in `.env.local`. `.env*` files are gitignored, except `.env.example`.
- Runtime config: `index.html` loads `/env.js`, which sets `window.__ENV__`. `src/app/config/env.ts` reads `window.__ENV__` first, then `import.meta.env`. In Docker, `docker-entrypoint.sh` renders `env.template.js` with `envsubst` into `/usr/share/nginx/html/env.js`, so one image works for every environment.
- `nginx.conf` (copied to `/etc/nginx/conf.d/default.conf`):
  - Uses Docker's DNS resolver and `set $backend_upstream backend:8080`, so the backend service must be named `backend`.
  - `index.html` and `env.js` are not cached; `/assets/` is cached immutable.
  - `^~ /api/api/` rewrites to `/api/` for a doubled prefix.
  - `/api/` is proxied to the backend.
  - Exact-match blocks for `/api/v1/chat/stream` (and the `/api/api/` variant) turn off buffering and gzip for SSE.
  - Falls back to the SPA `index.html`.
  - When adding a proxied path that needs special handling, remember that `location =` wins over `^~`, which wins over regex and prefix locations.

## Architecture

- `src/app/`: app shell.
  - `App.tsx` holds the `createBrowserRouter` routes and `router/guards/AuthGuard`.
  - `layouts/` has the Main, User and Auth layouts.
  - `providers/AppProviders.tsx` calls `configureApiClient({ baseUrl, getAccessToken: getCurrentIdToken })`.
  - `config/` has env, firebase, navigation and roles.
- `src/features/<feature>/` uses `api/`, `components/`, `hooks/`, `pages/` and `types/`. Features include auth, jobs, companies, candidate-profile, cv, career-chat (JobBeacon Agent at `/agent`), saved-jobs, recommendations, notifications, and the admin features `admin-overview`, `admin-jobs`, `admin-companies`, `admin-users`, `admin-categories`, `admin-skills`. Features don't import from each other; shared code lives in `src/shared/`.
- Admin site (separate site, same source — see `docs/admin-hien-trang.md`):
  - Entry `admin/index.html` → `src/app-admin/main.tsx`; built with `vite.admin.config.ts` (root `admin/`, shares `public/` and env). Routes `/login`, `/`, `/jobs`, `/companies`, `/users`, `/categories`, `/skills`.
  - `src/app-admin/`: `AdminApp.tsx` (router), `providers/AdminProviders.tsx`, `guards/AdminGuard.tsx` (requires `GET /api/v1/users/me` → `role: ADMIN`, `status: ACTIVE`), `layouts/AdminLayout.tsx`, `pages/AdminLoginPage.tsx`, global stylesheet `styles/admin.css` (ported from `ui-mockups/admin/`; admin components use its class names, not CSS Modules).
  - Shared admin UI in `src/shared/components/admin/` (Dialog, useConfirm, useToast, Pager, StatRow, TagInput, ...); `src/shared/api/case.ts` (`camelizeKeys`/`snakeizeKeys`/`unwrap`/`toQuery`); `src/shared/utils/admin-format.ts`.
  - Backend contract: `/api/v1/admin/**` documented in `../Jobbeacon-be/docs/admin-api.md`. First admin is bootstrapped on the backend with `APP_ADMIN_EMAILS`.
  - Feature code must not import `src/app-admin/**`; the user bundle must not import admin features.
- `src/shared/api/api-client.ts`: the only way to call the backend.
  - `apiClient.get/post/...` attaches the Firebase ID token, sets `Accept-Language: vi`, retries once with a forced token refresh on **401**, and throws `ApiError` (message from `data.detail`).
  - `authorizedFetch` returns the raw `Response` for streaming. Never use `EventSource`: it can't send `Authorization`.
- Backend contract: every response is wrapped in `ResponseGeneral<T>` (`status`, `message`, `data`, `timestamp`) and JSON is **snake_case**. Each `features/<feature>/api/*.api.ts` declares the snake_case DTOs and maps them to camelCase models. Paging is 1-based. API notes per feature are in `docs/api/`, and feature state docs are in `docs/*-hien-trang.md`.
- Chat streaming: `career-chat/api/sse.ts` parses the SSE events `tool_call`, `delta`, `done` and `error` from `POST /api/v1/chat/stream`. `useCareerChat` handles abort, stop and retry. See `docs/career-chat-hien-trang.md`.

# Chế độ điều phối (orchestrator)

Với task lớn, bạn là MAIN AGENT, vai trò điều phối. Không tự đọc hàng loạt file hay viết code lớn. Sub-agent của repo nằm ở `.claude/agents/`: `explorer` (chỉ đọc), `implementer` (làm một task), `reviewer` (PASS/FAIL).

## Quy trình
1. Phân tích yêu cầu, chia thành các task nhỏ (mỗi task gói gọn trong vài file).
   Ghi vào .work/<task-dir>/PLAN.md với: id, mô tả, phạm vi file, phụ thuộc, trạng thái.
2. Với mỗi task:
    - Chưa rõ code → giao `explorer`.
    - Thực hiện → giao `implementer`, truyền task-id.
    - Xong → giao `reviewer`.
3. Sau mỗi lần sub-agent trả về: cập nhật trạng thái trong PLAN.md NGAY.
4. Quyết định kiến trúc/quy ước mới phát sinh → ghi vào .work/CONVENTIONS.md
   để các sub-agent sau dùng chung.

## Quy tắc
- Task không đụng chung file → có thể chạy song song.
- Task đụng chung file → chạy tuần tự.
- Không yêu cầu sub-agent trả về nội dung file đầy đủ; chỉ cần tóm tắt + đường dẫn report.
- Nếu context bị reset/compact: đọc lại PLAN.md và CONVENTIONS.md để khôi phục trạng thái.
- Task cần hợp đồng API mới từ backend: ghi hợp đồng vào CONTEXT.md của task (endpoint, body, status, format lỗi/event); không sửa repo backend từ repo này.

## Quản lý workspace
- `.work/` nằm trong `.gitignore` (không commit plan/report).
- Mỗi task lớn mới: tạo thư mục .work/<YYYY-MM>-<slug>/ (PLAN.md, CONTEXT.md, reports/) và thêm 1 dòng vào .work/INDEX.md.
- Chỉ làm việc trong thư mục của task hiện tại. Không đọc reports của task khác
  trừ khi được yêu cầu.
- Luôn đọc .work/CONVENTIONS.md và .work/DECISIONS.md (cấp project) trước khi lập plan.
- Khi task hoàn thành:
    1. Chuyển quy ước/quyết định có giá trị lâu dài lên file cấp project.
    2. Chuyển thư mục task vào .work/archive/.
    3. Cập nhật INDEX.md.
- Khi bắt đầu session mới: đọc INDEX.md để biết task nào đang ACTIVE, rồi đọc PLAN.md của task đó.
