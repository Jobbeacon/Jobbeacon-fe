import { foldText, fmtNumber } from '../../../shared/utils/admin-format'
import { LEVEL_LABEL } from '../types/category.types'
import type { CategoryEntry, CategoryIndex } from '../types/category.types'

const MAX_SHOWN = 60

type CategorySearchResultsProps = {
  index: CategoryIndex
  query: string
  onReveal: (id: string) => void
}

// Tô đậm đoạn khớp (so khớp không dấu); foldText giữ nguyên độ dài chuỗi với tiếng Việt dựng sẵn.
function MarkMatch({ name, query }: { name: string; query: string }) {
  const folded = foldText(name)
  const key = foldText(query)
  const at = key ? folded.indexOf(key) : -1
  if (at < 0 || folded.length !== name.length) {
    return <>{name}</>
  }
  return (
    <>
      {name.slice(0, at)}
      <mark>{name.slice(at, at + key.length)}</mark>
      {name.slice(at + key.length)}
    </>
  )
}

export function CategorySearchResults({ index, query, onReveal }: CategorySearchResultsProps) {
  const key = foldText(query.trim())
  const matched: CategoryEntry[] = []
  for (const entry of index.byId.values()) {
    if (foldText(entry.node.name).includes(key)) {
      matched.push(entry)
    }
  }
  const shown = matched.slice(0, MAX_SHOWN)

  return (
    <div className="results">
      <p className="results-head">
        {fmtNumber(matched.length)} kết quả
        {matched.length > shown.length ? ` · hiện ${shown.length} đầu tiên` : ''}
      </p>
      <ul className="result-list">
        {shown.length === 0 ? (
          <li className="col-empty">Không có danh mục khớp “{query.trim()}”.</li>
        ) : (
          shown.map(({ node, path }) => (
            <li key={node.id}>
              <button className="result-item" type="button" onClick={() => onReveal(node.id)}>
                <span className="level-tag">{LEVEL_LABEL[Math.min(path.length, 3) - 1]}</span>
                <span className="result-name">
                  <MarkMatch name={node.name} query={query.trim()} />
                </span>
                <span className="crumbs">
                  {path
                    .slice(0, -1)
                    .map((item) => item.name)
                    .join(' › ') || 'Cấp cao nhất'}
                </span>
              </button>
              <span className="count-badge">{fmtNumber(node.jobCount)} tin</span>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
