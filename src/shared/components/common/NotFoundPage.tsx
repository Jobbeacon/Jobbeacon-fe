import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

export function NotFoundPage() {
  return (
    <main className={styles.page}>
      <h1>Không tìm thấy trang</h1>
      <p>Đường dẫn không đúng hoặc trang không còn tồn tại.</p>
      <div className={styles.actions}>
        <Link className={styles.primary} to="/">
          Về trang chủ
        </Link>
        <Link to="/jobs">Tìm việc làm</Link>
      </div>
    </main>
  )
}
