import { UserLayout } from '../../../app/layouts/UserLayout'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { useAuth } from '../../auth/hooks/useAuth'
import { ProfileForm } from '../components/ProfileForm'
import { useCandidateProfile } from '../hooks/useCandidateProfile'

export function CandidateProfilePage() {
  const { profile, isLoading, error, retry } = useCandidateProfile()
  const { user } = useAuth()
  const resolvedProfile = profile
    ? {
        ...profile,
        firebaseUid: profile.firebaseUid || user?.uid || null,
        email: profile.email || user?.email || '',
        fullName: profile.fullName || user?.displayName || '',
        avatarUrl: profile.avatarUrl || user?.photoUrl || null,
        emailVerified: profile.emailVerified ?? user?.emailVerified ?? null,
      }
    : null

  return (
    <UserLayout>
      <div className="profile-page">
        <header className="profile-page__heading">
          <div>
            <span className="profile-page__eyebrow">Tài khoản</span>
            <h1>Hồ sơ cá nhân</h1>
          </div>
          <p>Thông tin tài khoản đang được đồng bộ từ hệ thống JobBeacon.</p>
        </header>

        {isLoading ? <LoadingState label="Đang tải thông tin người dùng..." /> : null}
        {error ? <ErrorState message={error} onRetry={retry} /> : null}
        {resolvedProfile ? <ProfileForm profile={resolvedProfile} /> : null}
      </div>
    </UserLayout>
  )
}
