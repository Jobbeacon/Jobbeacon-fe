import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { FileText, Trash2, TriangleAlert, Upload, X } from 'lucide-react'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { ConfirmModal } from '../../../shared/components/ui/Modal'
import type { CvActionError } from '../hooks/useCvProfile'
import type { CvProfile, SkillSearchItem } from '../types/candidate-profile.types'
import { SkillSearch } from './SkillSearch'
import styles from './CvProfileSection.module.css'

const MAX_CV_SIZE = 10 * 1024 * 1024

type CvProfileSectionProps = {
  profile: CvProfile | null
  isLoading: boolean
  error: string | null
  isUploading: boolean
  isDeleting: boolean
  onRetry: () => void
  onUpload: (file: File) => Promise<CvActionError | null>
  onDelete: () => Promise<CvActionError | null>
  onAddSkill: (skill: SkillSearchItem) => Promise<CvActionError | null>
  onRemoveSkill: (skillId: string) => Promise<CvActionError | null>
}

function validateCvFile(file: File) {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (!isPdf) return 'Chỉ hỗ trợ file PDF.'
  if (file.size > MAX_CV_SIZE) return 'File CV tối đa 10MB.'
  return null
}

function formatMonth(value: string | null) {
  if (!value) return null
  const [year, month] = value.split('-')
  return month ? `${month}/${year}` : year
}

function formatPeriod(start: string | null, end: string | null, current = false) {
  const from = formatMonth(start)
  const to = current ? 'Hiện tại' : formatMonth(end)
  if (!from && !to) return null
  return `${from ?? '?'} – ${to ?? '?'}`
}

function formatExperience(months: number | null) {
  if (months === null || months <= 0) return null
  const years = Math.floor(months / 12)
  const rest = months % 12
  return [years ? `${years} năm` : null, rest ? `${rest} tháng` : null].filter(Boolean).join(' ')
}

export function CvProfileSection({
  profile,
  isLoading,
  error,
  isUploading,
  isDeleting,
  onRetry,
  onUpload,
  onDelete,
  onAddSkill,
  onRemoveSkill,
}: CvProfileSectionProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [actionError, setActionError] = useState<CvActionError | null>(null)
  const [lastFile, setLastFile] = useState<File | null>(null)
  const [confirming, setConfirming] = useState<'upload' | 'delete' | null>(null)

  const upload = async (file: File) => {
    setActionError(null)
    setLastFile(file)
    const result = await onUpload(file)
    setActionError(result)
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return

    const invalid = validateCvFile(file)
    if (invalid) {
      setActionError({ message: invalid, retryable: false })
      return
    }
    void upload(file)
  }

  // Upload CV ghi đè toàn bộ profile, kể cả skill nhập tay.
  const needsUploadWarning = Boolean(profile?.hasCv || (profile && profile.skills.length > 0))

  const openFilePicker = () => inputRef.current?.click()

  const pickFile = () => {
    if (needsUploadWarning) setConfirming('upload')
    else openFilePicker()
  }

  const confirmUpload = () => {
    setConfirming(null)
    // Vẫn trong sự kiện click của user nên trình duyệt cho mở hộp chọn file.
    openFilePicker()
  }

  const confirmDelete = async () => {
    setActionError(null)
    setLastFile(null)
    const result = await onDelete()
    setConfirming(null)
    setActionError(result)
  }

  const handleAddSkill = async (skill: SkillSearchItem) => {
    setActionError(null)
    setLastFile(null)
    setActionError(await onAddSkill(skill))
  }

  const handleRemoveSkill = async (skillId: string) => {
    setActionError(null)
    setLastFile(null)
    setActionError(await onRemoveSkill(skillId))
  }

  const busy = isUploading || isDeleting
  const hasCv = profile?.hasCv ?? false
  const skills = profile?.skills ?? []
  const experience = formatExperience(profile?.totalMonthsExperience ?? null)

  return (
    <section className={styles.card} aria-labelledby="cv-profile-title">
      <div className={styles.header}>
        <div>
          <h2 id="cv-profile-title">CV & kỹ năng</h2>
          <p>Tải CV (PDF) để hệ thống tự trích xuất kỹ năng và kinh nghiệm, hoặc tự thêm kỹ năng.</p>
        </div>
        {hasCv && !isUploading ? (
          <div className={styles.headerActions}>
            <button type="button" className={styles.secondary} onClick={pickFile} disabled={busy}>
              <Upload aria-hidden="true" /> Tải CV khác
            </button>
            <button type="button" className={styles.danger} onClick={() => setConfirming('delete')} disabled={busy}>
              <Trash2 aria-hidden="true" /> {isDeleting ? 'Đang xóa...' : 'Xóa CV'}
            </button>
          </div>
        ) : null}
      </div>

      <ConfirmModal
        open={confirming === 'upload'}
        title={profile?.hasCv ? 'Thay CV hiện tại?' : 'Tải CV lên?'}
        description={
          profile?.hasCv ? (
            <>
              <p>Tải CV mới sẽ ghi đè toàn bộ hồ sơ CV hiện tại.</p>
              <p>Toàn bộ kỹ năng, kể cả kỹ năng bạn tự thêm, sẽ được thay bằng kỹ năng trích từ CV mới.</p>
            </>
          ) : (
            <p>Các kỹ năng bạn tự thêm sẽ được thay bằng kỹ năng trích từ CV.</p>
          )
        }
        confirmLabel="Chọn file CV"
        icon={<TriangleAlert />}
        onConfirm={confirmUpload}
        onCancel={() => setConfirming(null)}
      />

      <ConfirmModal
        open={confirming === 'delete'}
        title="Xóa CV?"
        description={
          <>
            <p>CV và toàn bộ kỹ năng, kể cả kỹ năng tự thêm, sẽ bị xóa.</p>
            <p>Sở thích tìm việc vẫn được giữ nguyên.</p>
          </>
        }
        confirmLabel="Xóa CV"
        tone="danger"
        icon={<Trash2 />}
        isBusy={isDeleting}
        busyLabel="Đang xóa…"
        onConfirm={() => void confirmDelete()}
        onCancel={() => setConfirming(null)}
      />

      <input
        ref={inputRef}
        className={styles.hiddenInput}
        type="file"
        accept="application/pdf,.pdf"
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden="true"
      />

      {actionError ? (
        <div className={styles.actionError} role="alert">
          <span>{actionError.message}</span>
          {actionError.retryable && lastFile ? (
            <button type="button" onClick={() => void upload(lastFile)} disabled={busy}>
              Thử lại
            </button>
          ) : null}
        </div>
      ) : null}

      {isLoading ? <LoadingState label="Đang tải CV..." /> : null}
      {!isLoading && error ? <ErrorState message={error} onRetry={onRetry} /> : null}

      {isUploading ? (
        <LoadingState label="Đang phân tích CV, có thể mất tới 40 giây..." />
      ) : !isLoading && !error ? (
        <div className={styles.body}>
          {!hasCv ? (
            <button type="button" className={styles.dropzone} onClick={pickFile} disabled={busy}>
              <FileText aria-hidden="true" />
              <strong>{profile ? 'Chưa có CV · Chọn file CV' : 'Chọn file CV'}</strong>
              <span>PDF, tối đa 10MB, không đặt mật khẩu</span>
            </button>
          ) : null}

          {hasCv && profile && (profile.currentTitle || experience) ? (
            <p className={styles.meta}>
              {profile.currentTitle ? <strong>{profile.currentTitle}</strong> : null}
              {profile.currentTitle && experience ? ' · ' : null}
              {experience ? `${experience} kinh nghiệm` : null}
            </p>
          ) : null}
          {hasCv && profile?.summary ? <p className={styles.summary}>{profile.summary}</p> : null}

          <h3>Kỹ năng</h3>
          {skills.length > 0 ? (
            <ul className={styles.skills}>
              {skills.map((skill) => (
                <li key={skill.skillId} className={styles.skill}>
                  {skill.name}
                  <button
                    type="button"
                    onClick={() => void handleRemoveSkill(skill.skillId)}
                    aria-label={`Xóa kỹ năng ${skill.name}`}
                  >
                    <X aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className={styles.empty}>Chưa có kỹ năng nào.</p>
          )}
          <SkillSearch
            existingSkillIds={new Set(skills.map((skill) => skill.skillId))}
            onSelect={(skill) => void handleAddSkill(skill)}
            disabled={busy}
          />

          {hasCv && profile && profile.experiences.length > 0 ? (
            <>
              <h3>Kinh nghiệm</h3>
              <ul className={styles.timeline}>
                {profile.experiences.map((item, index) => (
                  <li key={`${item.company}-${item.title}-${index}`}>
                    <strong>{item.title || 'Vị trí chưa rõ'}</strong>
                    {item.company ? <span> · {item.company}</span> : null}
                    {formatPeriod(item.startDate, item.endDate, item.current) ? (
                      <small>{formatPeriod(item.startDate, item.endDate, item.current)}</small>
                    ) : null}
                    {item.description ? <p>{item.description}</p> : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {hasCv && profile && profile.educations.length > 0 ? (
            <>
              <h3>Học vấn</h3>
              <ul className={styles.timeline}>
                {profile.educations.map((item, index) => (
                  <li key={`${item.school}-${index}`}>
                    <strong>{item.school || 'Trường chưa rõ'}</strong>
                    {item.degree || item.major ? (
                      <span> · {[item.degree, item.major].filter(Boolean).join(', ')}</span>
                    ) : null}
                    {formatPeriod(item.startDate, item.endDate) ? (
                      <small>{formatPeriod(item.startDate, item.endDate)}</small>
                    ) : null}
                  </li>
                ))}
              </ul>
            </>
          ) : null}
        </div>
      ) : null}
    </section>
  )
}
