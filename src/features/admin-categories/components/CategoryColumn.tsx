import { ChevronRight, Pencil } from 'lucide-react'
import { fmtNumber } from '../../../shared/utils/admin-format'
import { LEVEL_LABEL } from '../types/category.types'
import type { CategoryNode } from '../types/category.types'

type CategoryColumnProps = {
  // 0, 1, 2
  level: number
  parent: CategoryNode | null
  items: CategoryNode[]
  selectedId: string
  flashId: string
  onOpen: (id: string) => void
  onEdit: (id: string) => void
  onAdd: (parentId: string) => void
}

// Một cột của trình duyệt danh mục: cột 1, 2 mở mục con; cột 3 bấm để sửa.
export function CategoryColumn({
  level,
  parent,
  items,
  selectedId,
  flashId,
  onOpen,
  onEdit,
  onAdd,
}: CategoryColumnProps) {
  const leaf = level >= 2
  const canAdd = level === 0 || parent !== null
  const aside = parent ? parent.name : level === 0 ? 'Cấp cao nhất' : '—'

  return (
    <div className="col">
      <div className="col-head">
        <div>
          <h2>{LEVEL_LABEL[level]}</h2>
          <span className="aside">{aside}</span>
        </div>
        {canAdd ? (
          <button className="btn ghost xs" type="button" onClick={() => onAdd(parent?.id ?? '')}>
            + Thêm
          </button>
        ) : null}
      </div>
      <ul className="col-list">
        {items.length === 0 ? (
          <li className="col-empty">
            {canAdd ? 'Chưa có mục nào.' : `Chọn một ${LEVEL_LABEL[level - 1].toLowerCase()} bên trái.`}
          </li>
        ) : (
          items.map((item) => {
            const className = [
              'col-row',
              item.id === selectedId ? 'is-open' : '',
              item.id === flashId ? 'is-flash' : '',
            ]
              .filter(Boolean)
              .join(' ')
            return (
              <li key={item.id} className={className} data-id={item.id}>
                <button
                  className="col-item"
                  type="button"
                  aria-expanded={leaf ? undefined : item.id === selectedId}
                  onClick={() => (leaf ? onEdit(item.id) : onOpen(item.id))}
                >
                  <span className="col-name">{item.name}</span>
                  {leaf ? null : (
                    <span className="col-meta">
                      {fmtNumber(item.children?.length ?? 0)} mục con · {fmtNumber(item.jobCount)} tin
                    </span>
                  )}
                </button>
                {/* API việc làm chưa lọc theo danh mục nên badge chỉ hiển thị số tin. */}
                {leaf ? <span className="count-badge">{fmtNumber(item.jobCount)} tin</span> : null}
                <button
                  className="icon-btn"
                  type="button"
                  title={`Sửa ${item.name}`}
                  aria-label={`Sửa ${item.name}`}
                  onClick={() => onEdit(item.id)}
                >
                  <Pencil aria-hidden="true" strokeWidth={1.8} />
                </button>
                {leaf ? null : <ChevronRight className="chev" aria-hidden="true" strokeWidth={2} />}
              </li>
            )
          })
        )}
      </ul>
    </div>
  )
}
