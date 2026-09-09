import type { UserProfile } from '../types/candidate-profile.types'

type ProfileFormProps = {
  profile: UserProfile
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

function formatDate(value: string | null) {
  if (!value) {
    return 'Chưa cập nhật'
  }

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('vi-VN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function ProfileItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-item">
      <dt>{label}</dt>
      <dd>{value || 'Chưa cập nhật'}</dd>
    </div>
  )
}

export function ProfileForm({ profile }: ProfileFormProps) {
  return (
    <section className="profile-card" aria-labelledby="profile-card-title">
      <div className="profile-card__summary">
        {profile.avatarUrl ? (
          <img src={profile.avatarUrl} alt="" className="profile-card__avatar" />
        ) : (
          <span className="profile-card__avatar profile-card__avatar--fallback" aria-hidden="true">
            {getInitials(profile.fullName, profile.email)}
          </span>
        )}

        <div>
          <h2 id="profile-card-title">{profile.fullName || 'Người dùng JobBeacon'}</h2>
          <p>{profile.email || 'Chưa cập nhật email'}</p>
          {profile.status ? <span className="profile-status">{profile.status}</span> : null}
        </div>
      </div>

      <div className="profile-card__divider" />

      <dl className="profile-details">
        <ProfileItem label="Họ và tên" value={profile.fullName} />
        <ProfileItem label="Email" value={profile.email} />
        <ProfileItem
          label="Vai trò"
          value={profile.roles.length > 0 ? profile.roles.join(', ') : 'Người dùng'}
        />
        <ProfileItem
          label="Trạng thái email"
          value={
            profile.emailVerified === null
              ? 'Chưa cập nhật'
              : profile.emailVerified
                ? 'Đã xác minh'
                : 'Chưa xác minh'
          }
        />
        {profile.id ? <ProfileItem label="Mã người dùng" value={profile.id} /> : null}
        {profile.firebaseUid ? (
          <ProfileItem label="Firebase UID" value={profile.firebaseUid} />
        ) : null}
        <ProfileItem label="Ngày tạo" value={formatDate(profile.createdAt)} />
        <ProfileItem label="Cập nhật gần nhất" value={formatDate(profile.updatedAt)} />
      </dl>
    </section>
  )
}
