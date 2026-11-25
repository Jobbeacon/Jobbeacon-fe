import { Link } from 'react-router-dom'
import { SourceChips } from '../../../shared/components/admin'
import { stamp } from '../../../shared/utils/admin-format'
import type { OverviewRecent } from '../types/overview.types'

// Bảng các lần ghi nhận gần nhất.
export function RecentCrawls({ rows }: { rows: OverviewRecent[] }) {
  return (
    <section className="sheet">
      <div className="sheet-head">
        <h2>Ghi nhận gần đây</h2>
      </div>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Thời điểm</th>
              <th>Nguồn</th>
              <th>Việc làm</th>
              <th>Công ty</th>
              <th>URL gốc</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={`${row.jobId}-${row.domain}-${row.crawledAt}-${index}`}>
                  <td className="when">{stamp(row.crawledAt)}</td>
                  <td>
                    <SourceChips domains={[row.domain]} to={(domain) => `/jobs?source=${encodeURIComponent(domain)}`} />
                  </td>
                  <td>
                    <Link className="row-link" to={`/jobs?job=${encodeURIComponent(row.jobId)}`}>
                      {row.jobTitle || 'Không có tiêu đề'}
                    </Link>
                  </td>
                  <td>
                    {row.companyId ? (
                      <Link className="row-link" to={`/jobs?company_id=${encodeURIComponent(row.companyId)}`}>
                        {row.companyName || '—'}
                      </Link>
                    ) : (
                      <span className="empty">{row.companyName || '—'}</span>
                    )}
                  </td>
                  <td>
                    {row.jobUrl ? (
                      <div className="url adm-overview-url" title={row.jobUrl}>
                        <a href={row.jobUrl} target="_blank" rel="noreferrer">
                          {row.jobUrl.replace(/^https?:\/\//, '')}
                        </a>
                      </div>
                    ) : (
                      <span className="empty">—</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="empty" colSpan={5}>
                  Chưa có ghi nhận nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="fine">Bấm tên việc làm để mở form sửa.</p>
    </section>
  )
}
