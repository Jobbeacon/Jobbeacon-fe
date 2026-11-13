import type { UserProfile } from '../types/candidate-profile.types'
import styles from './ProfileSummaryCard.module.css'

type ProfileSummaryCardProps = {
  profile: UserProfile
  currentTitle?: string | null
  summary: string
  openToWork?: boolean
}

function getInitials(name: string, email: string) {
  const source = name.trim() || email.trim() || 'U'
  return source
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((word) => word[0]?.toUpperCase())
    .join('')
}

export function ProfileSummaryCard({ profile, currentTitle, summary, openToWork }: ProfileSummaryCardProps) {
  return (
    <aside className={styles.card} aria-labelledby="profile-summary-title">
      <div className={styles.summary}>
        {profile.avatarUrl ? (
          <img className={styles.avatar} src={profile.avatarUrl} alt="" />
        ) : (
          <span className={styles.avatar} aria-hidden="true">
            {getInitials(profile.fullName, profile.email)}
          </span>
        )}
        <div className={styles.identity}>
          <h2 id="profile-summary-title">{profile.fullName || 'Người dùng JobBeacon'}</h2>
          {currentTitle ? <p className={styles.title}>{currentTitle}</p> : null}
          <p>{profile.email || 'Chưa cập nhật email'}</p>
          {profile.emailVerified ? (
            <span className={styles.badge}>Đã xác thực</span>
          ) : profile.emailVerified === false ? (
            <span className={`${styles.badge} ${styles.badgeMuted}`}>Chưa xác thực</span>
          ) : null}
          {openToWork ? <span className={`${styles.badge} ${styles.badgeOpen}`}>Đang tìm việc</span> : null}
        </div>
      </div>

      <hr className={styles.divider} />

      <p className={summary ? styles.bio : `${styles.bio} ${styles.bioEmpty}`}>
        {summary || 'Tải CV để hệ thống tự tạo phần giới thiệu về bạn.'}
      </p>
    </aside>
  )
}
