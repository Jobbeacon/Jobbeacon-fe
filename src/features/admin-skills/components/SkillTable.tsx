import { daysAgo, fmtNumber, shortDate } from '../../../shared/utils/admin-format'
import type { Skill } from '../types/skill.types'
import { normalizeName } from '../utils/skill-name'
import { Highlight } from './Highlight'

type SkillTableProps = {
  rows: Skill[]
  query: string
  loading: boolean
  onEdit: (skill: Skill) => void
  onDelete: (skill: Skill) => void
}

function AliasTags({ aliases }: { aliases: string[] }) {
  if (!aliases.length) {
    return <span className="empty">—</span>
  }
  return (
    <>
      {aliases.slice(0, 3).map((alias) => (
        <span key={alias} className="tag">
          {alias}
        </span>
      ))}
      {aliases.length > 3 ? <span className="tag tag--more">+{aliases.length - 3}</span> : null}
    </>
  )
}

export function SkillTable({ rows, query, loading, onEdit, onDelete }: SkillTableProps) {
  // Thanh usage so tương đối với kỹ năng nhiều tin nhất trong trang.
  const top = Math.max(1, ...rows.map((skill) => skill.jobCount))

  return (
    <div className="table-wrap" aria-busy={loading}>
      <table className="skill-table">
        <thead>
          <tr>
            <th>Kỹ năng</th>
            <th>Tên gọi khác</th>
            <th className="num">Số tin</th>
            <th className="num">CV</th>
            <th>Thêm lúc</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows.length ? (
            rows.map((skill) => (
              <tr key={skill.id}>
                <td>
                  <button className="name-btn" type="button" onClick={() => onEdit(skill)}>
                    <Highlight text={skill.name} query={query} />
                  </button>
                  <code className="norm-key">{normalizeName(skill.name)}</code>
                </td>
                <td>
                  <div className="tags">
                    <AliasTags aliases={skill.aliases} />
                  </div>
                </td>
                <td className="num">
                  <div className="usage">
                    <span
                      style={{
                        width: `${Math.max(skill.jobCount ? 3 : 0, Math.round((skill.jobCount / top) * 100))}%`,
                      }}
                    />
                  </div>
                  <b>{fmtNumber(skill.jobCount)}</b>
                </td>
                <td className="num">{fmtNumber(skill.cvCount)}</td>
                <td className="when">
                  {shortDate(skill.createdAt)}
                  {daysAgo(skill.createdAt) <= 7 ? (
                    <span className="sub">
                      <em className="new">Mới</em>
                    </span>
                  ) : null}
                </td>
                <td className="actions">
                  <button className="linkish" type="button" onClick={() => onEdit(skill)}>
                    Sửa
                  </button>
                  <button className="linkish danger" type="button" onClick={() => onDelete(skill)}>
                    Xóa
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td className="empty" colSpan={6}>
                {loading ? 'Đang tải…' : 'Không có kỹ năng khớp bộ lọc.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
