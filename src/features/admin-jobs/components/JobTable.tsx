import { Link } from 'react-router-dom'
import { SourceChips } from '../../../shared/components/admin'
import { EMPLOYMENT_LABEL, money, shortDate, stamp } from '../../../shared/utils/admin-format'
import type { JobRow } from '../types/admin-job.types'
import { isExpired } from '../utils/job-form'

type JobTableProps = {
  rows: JobRow[] | undefined
  loading: boolean
  error?: string
  onEdit: (id: string) => void
  onDelete: (job: JobRow) => void
}

function Places({ places }: { places: string[] | null }) {
  if (!places?.length) {
    return <>—</>
  }
  return (
    <>
      {places[0]}
      {places.length > 1 ? <> <span className="more">+{places.length - 1}</span></> : null}
    </>
  )
}

function TermPill({ expiredDate }: { expiredDate: string | null }) {
  if (isExpired(expiredDate)) {
    return (
      <>
        <span className="pill pill--off"><i />Hết hạn</span>
        <span className="sub">{shortDate(expiredDate)}</span>
      </>
    )
  }
  return (
    <>
      <span className="pill"><i />Còn hạn</span>
      <span className="sub">{expiredDate ? `đến ${shortDate(expiredDate)}` : 'Không ghi hạn'}</span>
    </>
  )
}

export function JobTable({ rows, loading, error, onEdit, onDelete }: JobTableProps) {
  let body
  if (error || !rows || !rows.length) {
    const message = error ?? (rows ? 'Không có tin khớp bộ lọc.' : 'Đang tải…')
    body = (
      <tr>
        <td className="empty" colSpan={8}>{message}</td>
      </tr>
    )
  } else {
    body = rows.map((job) => (
      <tr key={job.id}>
        <td className="job-cell">
          <button className="name-btn" type="button" onClick={() => onEdit(job.id)}>
            {job.title || '(Chưa có tiêu đề)'}
          </button>
          <span className="sub">
            {job.employmentType ? EMPLOYMENT_LABEL[job.employmentType] ?? job.employmentType : 'Chưa rõ loại hình'}
          </span>
        </td>
        <td className="company-cell">
          {job.companyId ? (
            <Link
              className="row-link"
              to={`/jobs?company_id=${encodeURIComponent(job.companyId)}`}
              title={job.companyName ?? undefined}
            >
              {job.companyName ?? '—'}
            </Link>
          ) : (
            job.companyName ?? '—'
          )}
        </td>
        <td className="when"><Places places={job.locations} /></td>
        <td className="when">{money(job.minSalary, job.maxSalary, job.currency ?? 'VND')}</td>
        <td className="when"><TermPill expiredDate={job.expiredDate} /></td>
        <td><div className="sources"><SourceChips domains={job.sources ?? []} /></div></td>
        <td className="when">{stamp(job.lastCrawledAt)}</td>
        <td className="actions">
          <button className="linkish" type="button" onClick={() => onEdit(job.id)}>Sửa</button>
          <button className="linkish danger" type="button" onClick={() => onDelete(job)}>Xóa</button>
        </td>
      </tr>
    ))
  }

  return (
    <div className="table-wrap">
      <table className="job-table" aria-busy={loading}>
        <thead>
          <tr>
            <th>Việc làm</th>
            <th>Công ty</th>
            <th>Địa điểm</th>
            <th>Lương</th>
            <th>Hạn nộp</th>
            <th>Nguồn</th>
            <th>Crawl gần nhất</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{body}</tbody>
      </table>
    </div>
  )
}
