import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { useAuth } from '../../auth/hooks/useAuth'
import { CvProfileSection } from '../components/CvProfileSection'
import { ProfileForm } from '../components/ProfileForm'
import { ProfileSummaryCard } from '../components/ProfileSummaryCard'
import { useCandidateProfile } from '../hooks/useCandidateProfile'
import { useCvProfile } from '../hooks/useCvProfile'
import { useJobPreference } from '../hooks/useJobPreference'
import { useProvinces } from '../hooks/useProvinces'
import type { JobPreferenceFormValues } from '../types/candidate-profile.types'
import { toFormValues, toRequestDto, validateFormValues } from '../utils/job-preference-form'
import styles from './CandidateProfilePage.module.css'

type Notice = { message: string; tone: 'success' | 'error' }

export function CandidateProfilePage() {
  const { profile, isLoading, error, retry } = useCandidateProfile()
  const { user } = useAuth()
  const jobPreference = useJobPreference()
  const cvProfile = useCvProfile()
  const { provinces } = useProvinces()
  // null = chưa sửa, form hiển thị theo dữ liệu đã lưu.
  const [draft, setDraft] = useState<JobPreferenceFormValues | null>(null)
  const [notice, setNotice] = useState<Notice | null>(null)

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

  const savedPreference = jobPreference.preference
  const formValues = draft ?? (savedPreference ? toFormValues(savedPreference) : null)

  const handleChange = (next: JobPreferenceFormValues) => {
    setDraft(next)
    setNotice(null)
  }

  const handleSubmit = async (values: JobPreferenceFormValues) => {
    const invalid = validateFormValues(values)
    if (invalid) {
      setNotice({ message: invalid, tone: 'error' })
      return
    }

    const saveError = await jobPreference.save(toRequestDto(values))
    if (saveError) {
      setNotice({ message: saveError, tone: 'error' })
      return
    }
    setDraft(null)
    setNotice({ message: 'Đã lưu sở thích tìm việc.', tone: 'success' })
  }

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> · Hồ sơ
        </nav>
        <h1>Hồ sơ của bạn</h1>
        <p>Skill, kinh nghiệm và vị trí mong muốn sẽ dùng cho gợi ý việc làm sau này.</p>
      </section>

      <section className={styles.section}>
        {isLoading ? <LoadingState label="Đang tải thông tin người dùng..." /> : null}
        {error ? <ErrorState message={error} onRetry={retry} /> : null}
        {resolvedProfile ? (
          <div className={styles.grid}>
            <ProfileSummaryCard
              profile={resolvedProfile}
              currentTitle={cvProfile.profile?.currentTitle}
              summary={cvProfile.profile?.summary?.trim() ?? ''}
              openToWork={savedPreference?.openToWork}
            />

            <div className={styles.main}>
              {jobPreference.isLoading ? <LoadingState label="Đang tải sở thích tìm việc..." /> : null}
              {jobPreference.error ? (
                <ErrorState message={jobPreference.error} onRetry={jobPreference.retry} />
              ) : null}
              {formValues ? (
                <ProfileForm
                  value={formValues}
                  provinces={provinces}
                  onChange={handleChange}
                  onSubmit={(values) => void handleSubmit(values)}
                  isSubmitting={jobPreference.isSaving}
                  isNew={savedPreference?.id === null}
                  notice={notice}
                />
              ) : null}

              <CvProfileSection
                profile={cvProfile.profile}
                isLoading={cvProfile.isLoading}
                error={cvProfile.error}
                isUploading={cvProfile.isUploading}
                isDeleting={cvProfile.isDeleting}
                onRetry={cvProfile.retry}
                onUpload={cvProfile.upload}
                onDelete={cvProfile.remove}
                onAddSkill={cvProfile.addSkill}
                onRemoveSkill={cvProfile.removeSkill}
              />
            </div>
          </div>
        ) : null}
      </section>
    </main>
  )
}
