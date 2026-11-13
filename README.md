# JobBeacon Frontend

## Cấu hình Firebase Authentication

Tạo file `.env.local` ở thư mục gốc và điền cấu hình Web App lấy từ Firebase Console:

```dotenv
VITE_API_BASE_URL=http://localhost:8080
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

`VITE_API_BASE_URL` có thể để trống nếu frontend và backend cùng origin. Mọi request
backend đi qua `src/shared/api/api-client.ts`; các endpoint cần xác thực sẽ tự gắn
Firebase ID token vào header `Authorization: Bearer <token>`.

Trong Firebase Console, mở **Authentication → Sign-in method** và bật:

- Email/Password
- Google

Khi triển khai lên tên miền thật, thêm tên miền đó vào **Authentication → Settings → Authorized domains**.

Chạy dự án:

```bash
npm install
npm run dev
```

Các màn xác thực hiện có:

- `/login`: đăng nhập email/mật khẩu hoặc Google.
- `/register`: tạo tài khoản email/mật khẩu và lưu họ tên vào Firebase profile.
- `/forgot-password`: gửi email đặt lại mật khẩu.
- `/profile`: lấy thông tin tài khoản từ `GET /api/v1/users/me`.

## Trang quản trị (Admin)

Site admin dùng chung source với site người dùng nhưng build/deploy riêng:

```bash
npm run dev:admin      # http://localhost:5174
npm run build:admin    # → dist-admin/
docker build --build-arg APP_TARGET=admin -t jobbeacon-admin .
```

Chi tiết: `docs/admin-hien-trang.md`. Backend cần `APP_ADMIN_EMAILS` để tạo admin đầu tiên.

## React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
