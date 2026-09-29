import styles from './JobFilters.module.css'

// Các nhóm lọc trong mockup mà backend chưa hỗ trợ: hiển thị nhưng khóa lại.
const upcomingGroups = [
  { title: 'Địa điểm', options: ['Hà Nội', 'Hồ Chí Minh', 'Đà Nẵng', 'Remote'] },
  { title: 'Ngành nghề', options: ['Công nghệ', 'Tài chính', 'Marketing'] },
  { title: 'Kỹ năng', options: ['Java', 'Spring', 'SQL', 'ReactJS'] },
  { title: 'Kinh nghiệm', options: ['Chưa có KN', '1 - 3 năm', '3 - 5 năm', 'Trên 5 năm'] },
  { title: 'Loại hình', options: ['Full-time', 'Part-time', 'Hợp đồng', 'Internship'] },
  { title: 'Ngày đăng', options: ['24 giờ qua', '7 ngày qua', '30 ngày qua'] },
  { title: 'Nguồn tuyển dụng', options: ['TopCV', 'ITviec', 'VietnamWorks', 'CareerViet'] },
]

export function JobFilters({ onReset }: { onReset: () => void }) {
  return (
    <aside className={styles.filterCard} aria-label="Bộ lọc">
      <h2>
        Bộ lọc
        <button type="button" onClick={onReset}>
          Xóa lọc
        </button>
      </h2>

      <p className={styles.upcomingNote}>Các bộ lọc dưới đây đang được phát triển.</p>
      {upcomingGroups.map((group) => (
        <fieldset className={styles.group} key={group.title} disabled>
          <legend>{group.title}</legend>
          {group.options.map((option) => (
            <label className={styles.option} key={option}>
              <input type="checkbox" />
              {option}
            </label>
          ))}
        </fieldset>
      ))}
    </aside>
  )
}
