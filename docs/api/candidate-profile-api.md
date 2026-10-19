# API contract — Hồ sơ ứng viên (job preference + CV profile)

Nguồn: backend `Jobbeacon-be` (branch `feature/extract-cv`). Cập nhật: 2026-10-15.

## Quy ước chung

- Base URL: `/api/v1`. Mọi endpoint dưới đây **bắt buộc đăng nhập**: header `Authorization: Bearer <Firebase ID token>`. Thiếu/sai token → `403` (body không theo format bên dưới).
- Dữ liệu luôn thuộc user đang đăng nhập (`/me/...`), không truyền user id.
- JSON dùng **snake_case** cho cả request và response.
- Ngôn ngữ thông báo lỗi theo header `Accept-Language` (`vi` hoặc `en`).

### Response thành công

```json
{
  "status": 200,
  "message": "success",
  "data": { },
  "timestamp": "2026-10-15"
}
```

### Response lỗi

```json
{
  "status": 400,
  "message": "Bad Request",
  "data": {
    "code": "job_preference_invalid_salary_range",
    "detail": "Mức lương tối thiểu không được lớn hơn mức lương tối đa"
  },
  "timestamp": "2026-10-15"
}
```

- `data.code`: mã lỗi ổn định, FE dùng để rẽ nhánh xử lý.
- `data.detail`: câu thông báo đã dịch theo `Accept-Language`, có thể hiển thị thẳng cho user.
- Khi có nhiều lỗi validation cùng lúc, backend chỉ trả **lỗi đầu tiên**.

---

## 1. Sở thích tìm việc (job preference)

Thông tin user tự khai: vị trí mong muốn, tỉnh/thành, hình thức làm việc, lương kỳ vọng. **Độc lập với CV**: dùng được khi chưa upload CV; upload/xóa CV không ảnh hưởng.

### Kiểu dữ liệu

```ts
type EmploymentType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR' | 'TEMPORARY' | 'INTERN'
type SalaryCurrency = 'VND' | 'USD'
type SalaryPeriod = 'HOUR' | 'DAY' | 'MONTH' | 'YEAR'

type LocationItem = {
  id: string    // mã tỉnh, vd "01", "79" — cùng id với GET /api/v1/locations/provinces
  name: string  // vd "Hà Nội"
}

type JobPreference = {
  id: string | null                 // null khi user chưa lưu lần nào
  desired_titles: string[]
  provinces: LocationItem[]         // sắp xếp theo id
  employment_types: EmploymentType[]
  remote_ok: boolean
  expected_salary_min: number | null  // số tiền đầy đủ, vd 20000000 (VND) hoặc 1500 (USD)
  expected_salary_max: number | null
  currency: SalaryCurrency
  salary_period: SalaryPeriod
  salary_negotiable: boolean
  open_to_work: boolean
  updated_at: string | null         // ISO-8601 UTC, vd "2026-10-15T03:12:45.123Z"
}

type JobPreferenceRequest = {
  desired_titles?: string[] | null
  province_ids?: string[] | null
  employment_types?: EmploymentType[] | null
  remote_ok?: boolean | null
  expected_salary_min?: number | null
  expected_salary_max?: number | null
  currency?: SalaryCurrency | null
  salary_period?: SalaryPeriod | null
  salary_negotiable?: boolean | null
  open_to_work?: boolean | null
}
```

Giá trị mặc định (khi chưa lưu, hoặc khi gửi `null`/bỏ trường):

| Trường | Mặc định |
|---|---|
| `desired_titles`, `provinces`, `employment_types` | `[]` |
| `remote_ok` | `false` |
| `expected_salary_min`, `expected_salary_max` | `null` |
| `currency` | `"VND"` |
| `salary_period` | `"MONTH"` |
| `salary_negotiable` | `false` |
| `open_to_work` | `true` |

Gợi ý hiển thị: `FULL_TIME` Toàn thời gian · `PART_TIME` Bán thời gian · `CONTRACTOR` Hợp đồng/Freelance · `TEMPORARY` Thời vụ · `INTERN` Thực tập. `MONTH` /tháng · `YEAR` /năm · `DAY` /ngày · `HOUR` /giờ.

### `GET /api/v1/me/job-preference`

Lấy sở thích của user. **Không bao giờ trả 404**: nếu user chưa lưu, trả object mặc định với `id: null` (FE dùng `id === null` để biết là chưa khai).

Response `200`:

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "id": "0192a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
    "desired_titles": ["Backend Developer", "Java Developer"],
    "provinces": [
      { "id": "01", "name": "Hà Nội" },
      { "id": "79", "name": "Hồ Chí Minh" }
    ],
    "employment_types": ["FULL_TIME"],
    "remote_ok": true,
    "expected_salary_min": 20000000,
    "expected_salary_max": 30000000,
    "currency": "VND",
    "salary_period": "MONTH",
    "salary_negotiable": false,
    "open_to_work": true,
    "updated_at": "2026-10-15T03:12:45.123Z"
  },
  "timestamp": "2026-10-15"
}
```

### `PUT /api/v1/me/job-preference`

Lưu sở thích — **thay thế toàn bộ** (không phải patch). Trường không gửi hoặc `null` sẽ về mặc định, nên FE luôn gửi đủ form. Lần đầu gọi sẽ tạo mới. Response giống `GET` (kèm `id` đã có).

Request:

```json
{
  "desired_titles": ["Backend Developer", "Java Developer"],
  "province_ids": ["01", "79"],
  "employment_types": ["FULL_TIME"],
  "remote_ok": true,
  "expected_salary_min": 20000000,
  "expected_salary_max": 30000000,
  "currency": "VND",
  "salary_period": "MONTH",
  "salary_negotiable": false,
  "open_to_work": true
}
```

Quy tắc & xử lý của backend:

| Trường | Ràng buộc | Ghi chú |
|---|---|---|
| `desired_titles` | ≤ 5 phần tử; mỗi phần tử không rỗng, ≤ 100 ký tự | Backend trim và bỏ trùng không phân biệt hoa thường (giữ cách viết đầu tiên) |
| `province_ids` | ≤ 5; mỗi id phải tồn tại | Lấy danh sách từ `GET /api/v1/locations/provinces`; id trùng bị gộp |
| `employment_types` | thuộc `EmploymentType` | Không phân biệt hoa thường; trùng bị gộp |
| `expected_salary_min/max` | số nguyên ≥ 0; `min ≤ max` nếu có cả hai | Gửi số đầy đủ (20 triệu = `20000000`), không phải "20" |
| `currency` | `VND` \| `USD` | |
| `salary_period` | `HOUR` \| `DAY` \| `MONTH` \| `YEAR` | UI có thể chỉ cho chọn MONTH/YEAR |

Lỗi (`400`):

| `data.code` | Khi nào |
|---|---|
| `job_preference_too_many_titles` | > 5 vị trí |
| `job_preference_invalid_title` | Vị trí rỗng |
| `job_preference_title_too_long` | Vị trí > 100 ký tự |
| `job_preference_too_many_provinces` | > 5 tỉnh |
| `job_preference_invalid_province` | Id tỉnh rỗng hoặc không tồn tại |
| `job_preference_invalid_employment_type` | Hình thức làm việc không hợp lệ |
| `job_preference_invalid_salary` | Lương âm |
| `job_preference_invalid_salary_range` | `expected_salary_min > expected_salary_max` |
| `job_preference_invalid_currency` | Tiền tệ không hợp lệ |
| `job_preference_invalid_salary_period` | Kỳ trả lương không hợp lệ |

> ⚠️ Hiện tại body JSON sai kiểu (vd. `"expected_salary_min": "abc"`) hoặc hỏng cú pháp trả `500` thay vì `400`. FE nên validate kiểu số trước khi gửi.

---

## 2. CV profile

Profile trích xuất tự động từ file CV (PDF). Mỗi user có tối đa 1 profile; **upload CV mới sẽ ghi đè toàn bộ** (kể cả skill user đã xóa trước đó).

### Kiểu dữ liệu

```ts
type CvExperience = {
  title: string | null
  company: string | null
  start_date: string | null   // "YYYY-MM"
  end_date: string | null     // "YYYY-MM"; null nếu đang làm
  current: boolean
  description: string | null
  skills: string[] | null
}

type CvEducation = {
  school: string | null
  degree: string | null
  major: string | null
  start_date: string | null   // "YYYY-MM"
  end_date: string | null
}

type CvProfileSkill = {
  skill_id: string            // dùng để xóa skill
  name: string
  confidence: number | null   // 0..1, 3 chữ số thập phân
  experience_months: number | null
  last_used_at: string | null // "YYYY-MM-DD" (ngày 01 của tháng)
}

type CvProfile = {
  id: string
  current_title: string | null
  summary: string | null
  total_months_experience: number | null
  experiences: CvExperience[]
  educations: CvEducation[]
  parsed_at: string | null    // ISO-8601 UTC
  updated_at: string | null
  skills: CvProfileSkill[]
}

type CvProfileSkills = {
  profile_id: string
  skills: CvProfileSkill[]
}
```

### `POST /api/v1/me/cv-profile/extract`

Upload CV và trích xuất. Xử lý **đồng bộ**, có thể mất tới ~30–40 giây khi phải gọi model — FE nên hiển thị loading và đặt timeout request ≥ 60s.

- Content-Type: `multipart/form-data`, field **`file`** (đúng tên này).
- Chỉ nhận PDF, ≤ 10MB, ≤ 20 trang, không đặt mật khẩu.
- Thành công → `200`, `data: CvProfile` (profile đã lưu). Thất bại → không ghi gì.

Lỗi:

| HTTP | `data.code` | Khi nào |
|---|---|---|
| 400 | `cv_invalid_file_type` | Không có file / không phải PDF / sai tên field |
| 413 | `cv_file_too_large`, `file_size_exceeded` | File > 10MB |
| 400 | `cv_too_many_pages` | Quá số trang cho phép |
| 400 | `cv_password_protected` | PDF có mật khẩu |
| 400 | `cv_unreadable` | PDF hỏng / không đọc được |
| 422 | `cv_insufficient_data` | Không trích xuất đủ thông tin |
| 504 | `cv_model_timeout` | Xử lý quá thời gian — cho phép thử lại |
| 503 | `cv_model_error` | Dịch vụ xử lý tạm lỗi — cho phép thử lại |

### `GET /api/v1/me/cv-profile`

Lấy toàn bộ CV profile. `200` với `data: CvProfile`; chưa có profile → `404` `cv_profile_not_found`.

### `DELETE /api/v1/me/cv-profile`

Xóa CV profile (kèm toàn bộ skill). `200` với `data: null`; chưa có profile → `404` `cv_profile_not_found`. Không ảnh hưởng job preference.

### `GET /api/v1/me/cv-profile/skills`

Chỉ lấy skill của profile, dùng cho trang profile.

Response `200`:

```json
{
  "status": 200,
  "message": "success",
  "data": {
    "profile_id": "0192a3b4-0000-7000-8000-000000000001",
    "skills": [
      {
        "skill_id": "0191f2e3-0000-7000-8000-000000000002",
        "name": "Java",
        "confidence": 0.9,
        "experience_months": 36,
        "last_used_at": "2025-06-01"
      }
    ]
  },
  "timestamp": "2026-10-15"
}
```

Chưa có profile → `404` `cv_profile_not_found` (FE hiển thị trạng thái "chưa upload CV").

### `DELETE /api/v1/me/cv-profile/skills/{skillId}`

Xóa một skill khỏi profile (chỉ gỡ khỏi profile, không xóa skill khỏi hệ thống). `200` với `data: null`.

| HTTP | `data.code` | Khi nào |
|---|---|---|
| 404 | `cv_profile_not_found` | User chưa có profile |
| 404 | `cv_profile_skill_not_found` | Skill không thuộc profile |
| 400 | — | `skillId` không phải UUID |

Lưu ý: upload CV mới sẽ thay toàn bộ skill, skill đã xóa có thể xuất hiện lại.

---

## Gợi ý cho trang profile

- Tải song song: `GET /me/job-preference`, `GET /me/cv-profile/skills` (404 → chưa có CV), `GET /locations/provinces` (cho dropdown tỉnh).
- Form sở thích map thẳng sang `JobPreferenceRequest`; lưu bằng `PUT` với đủ trường.
- Lương: nhập theo "triệu" trên UI thì nhân `1_000_000` trước khi gửi (VND).
