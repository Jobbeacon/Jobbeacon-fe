import { Link } from 'react-router-dom'
import { LogoMark, SourceChips } from '../../../shared/components/admin'
import { daysAgo, fmtNumber, shortDate, stamp } from '../../../shared/utils/admin-format'
import type { CompanyRow } from '../types/company.types'
import { Highlight } from './Highlight'

type CompanyTableProps = {
  rows: CompanyRow[]
  query: string
  loading: boolean
  onEdit: (id: string) => void
  onDelete: (company: CompanyRow) => void
}

export function CompanyTable({ rows, query, loading, onEdit, onDelete }: CompanyTableProps) {
  return (
    <div className="table-wrap" aria-busy={loading}>
      <table>
        <thead>
          <tr>
            <th>Công ty</th>
            <th className="num">Tin</th>
            <th>Nguồn</th>
            <th>Tạo lúc</th>
            <th>Crawl gần nhất</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((company) => (
              <tr key={company.id}>
                <td>
                  <div className="who">
                    <LogoMark name={company.name} logoUrl={company.logoUrl} />
                    <span className="company-name">
                      <button className="name-btn" type="button" onClick={() => onEdit(company.id)}>
                        <Highlight text={company.name} query={query} />
                      </button>
                      {company.locations.length ? (
                        <span className="sub">{company.locations.join(' · ')}</span>
                      ) : !company.openJobCount ? (
                        <span className="sub">Chưa có tin còn hạn</span>
                      ) : null}
                    </span>
                  </div>
                </td>
                <td className="num">
                  <Link className="text-link" to={`/jobs?company_id=${encodeURIComponent(company.id)}`}>
                    {fmtNumber(company.jobCount)}
                  </Link>
                  <span className="sub">{fmtNumber(company.openJobCount)} đang tuyển</span>
                </td>
                <td>
                  <div className="sources">
                    <SourceChips domains={company.sources} to={(domain) => `/jobs?source=${encodeURIComponent(domain)}`} />
                  </div>
                </td>
                <td className="when">
                  {shortDate(company.createdAt)}
                  {daysAgo(company.createdAt) <= 7 ? (
                    <span className="sub">
                      <em className="new">Mới</em>
                    </span>
                  ) : null}
                </td>
                <td className="when">{stamp(company.lastCrawledAt)}</td>
                <td className="actions">
                  <button className="linkish" type="button" onClick={() => onEdit(company.id)}>
                    Sửa
                  </button>
                  <button className="linkish danger" type="button" onClick={() => onDelete(company)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty" colSpan={6}>
                {loading ? 'Đang tải…' : 'Không có công ty khớp bộ lọc.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
