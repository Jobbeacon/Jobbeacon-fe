# Trang quản trị (Admin) — hiện trạng

## Kiến trúc
- Hai site, chung một source:
  - Site người dùng: `index.html` → `src/main.tsx` → `src/app/`. `npm run dev` (5173), `npm run build` → `dist/`.
  - Site admin: `admin/index.html` → `src/app-admin/main.tsx`. `npm run dev:admin` (5174), `npm run build:admin` → `dist-admin/`. Cấu hình: `vite.admin.config.ts`.
- Docker: `docker build --build-arg APP_TARGET=admin -t jobbeacon-admin .` (mặc định `user`). Cùng `nginx.conf` (proxy `/api/` tới `backend:8080`) và `env.js` runtime → deploy 2 container/2 domain (vd. `jobbeacon.xxx`, `admin.jobbeacon.xxx`).
- Code: app shell `src/app-admin/`; feature `src/features/admin-{overview,jobs,companies,users,categories,skills}`; UI dùng chung `src/shared/components/admin/`.
- Giao diện bám mockup `ui-mockups/admin/` (stylesheet `src/app-admin/styles/admin.css`).

## Đăng nhập & phân quyền
- Đăng nhập Firebase (email/mật khẩu hoặc Google) ở `/login`. Sau đó FE gọi `GET /api/v1/users/me`; chỉ `role = ADMIN` và `status = ACTIVE` mới vào được, còn lại bị đăng xuất.
- Backend chặn `/api/v1/admin/**` theo role trong DB (403). Admin đầu tiên: đặt env `APP_ADMIN_EMAILS=email@...` cho backend; tài khoản đó thành ADMIN ở lần gọi API kế tiếp. Sau đó có thể cấp quyền cho người khác ở trang Người dùng.
- Phiên đăng nhập của site admin và site người dùng là riêng (khác origin).

## Các trang
| Route | Nội dung | API |
|---|---|---|
| `/` | Vận hành crawl: KPI, biểu đồ theo ngày/tháng theo nguồn, tỉ lệ nền tảng, khung giờ, ghi nhận gần đây | `GET /admin/overview` |
| `/jobs` | Danh sách tin (lọc q/nguồn/loại hình/công ty/crawl/hạn, sắp xếp), sửa tin, xóa tin | `/admin/jobs*` |
| `/companies` | Danh sách công ty, sửa tên/logo, gộp bản trùng, xóa công ty không còn tin | `/admin/companies*` |
| `/users` | Danh sách tài khoản, đổi vai trò/trạng thái, khóa/mở khóa, xem CV & nguyện vọng | `/admin/users*` |
| `/categories` | Cây danh mục 3 cấp: thêm/sửa/xóa, tìm kiếm | `/admin/categories*` |
| `/skills` | Kỹ năng + tên gọi khác: thêm/sửa/gộp/xóa, lọc mới/chưa alias/chưa dùng | `/admin/skills*` |

Hợp đồng API đầy đủ: `../Jobbeacon-be/docs/admin-api.md`.

## Env
- `VITE_USER_SITE_URL`: URL site người dùng cho link "Xem trên trang tìm việc" trong form sửa tin (rỗng → ẩn link).

## Hạn chế đã biết
- Bộ lọc của mockup mà API chưa hỗ trợ đã bỏ: tin "nhiều nguồn"/"thiếu danh mục", công ty "nghi trùng"/"thiếu logo", user "chưa xác minh", lọc user theo CV.
- Danh mục/kỹ năng mới chỉ có embedding nếu backend gọi Gemini thành công.
- Gộp công ty: nếu crawler gặp lại tên cũ sẽ tạo lại công ty đó (chưa có bảng alias công ty).
