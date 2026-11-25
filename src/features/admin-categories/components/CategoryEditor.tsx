import { useState } from 'react'
import type { FormEvent } from 'react'
import { Dialog } from '../../../shared/components/admin'
import { fmtNumber } from '../../../shared/utils/admin-format'
import { LEVEL_LABEL } from '../types/category.types'
import type { CategoryNode } from '../types/category.types'

// Đang sửa node có sẵn hoặc thêm mới dưới parent (path rỗng = cấp cao nhất).
export type CategoryDraft = {
  category: CategoryNode | null
  parentPath: CategoryNode[]
}

type CategoryEditorProps = {
  draft: CategoryDraft | null
  saving: boolean
  onClose: () => void
  onSave: (name: string) => void
  onDelete: () => void
}

export function CategoryEditor({ draft, saving, onClose, onSave, onDelete }: CategoryEditorProps) {
  return (
    <Dialog open={draft !== null} onClose={onClose} className="modal form-modal" labelledBy="category-heading">
      {draft ? (
        <CategoryForm draft={draft} saving={saving} onClose={onClose} onSave={onSave} onDelete={onDelete} />
      ) : null}
    </Dialog>
  )
}

// Tách form để state tên reset mỗi lần mở (Dialog chỉ render children khi open).
function CategoryForm({ draft, saving, onClose, onSave, onDelete }: CategoryEditorProps & { draft: CategoryDraft }) {
  const { category, parentPath } = draft
  const [name, setName] = useState(category?.name ?? '')
  const level = Math.min(parentPath.length, 2)
  const label = LEVEL_LABEL[level].toLowerCase()

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const value = name.trim()
    if (!value || saving) {
      return
    }
    onSave(value)
  }

  return (
    <form spellCheck={false} onSubmit={handleSubmit}>
      <div className="drawer-bar">
        <h2 id="category-heading">{category ? `Sửa ${label}` : `Thêm ${label}`}</h2>
      </div>
      <div className="drawer-body">
        <div className="field">
          <span>Nằm trong</span>
          <p className="place">
            {parentPath.length ? parentPath.map((node) => node.name).join(' › ') : 'Cấp cao nhất'}
          </p>
        </div>
        <label className="field">
          <span>Tên</span>
          <input
            name="name"
            required
            maxLength={255}
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        {category ? (
          <dl className="meta">
            <div>
              <dt>Mục con</dt>
              <dd>{fmtNumber(category.children?.length ?? 0)}</dd>
            </div>
            <div>
              <dt>Tin đã gán</dt>
              <dd>{fmtNumber(category.jobCount)} tin</dd>
            </div>
          </dl>
        ) : null}
        <p className="fine">
          Muốn chuyển mục sang nhánh khác thì gỡ rồi tạo lại ở nhánh mới, để tin không bị gán nhầm.
        </p>
      </div>
      <div className="drawer-actions split">
        {category ? (
          <button className="btn text-danger" type="button" disabled={saving} onClick={onDelete}>
            Xóa
          </button>
        ) : (
          <span />
        )}
        <div className="actions-end">
          <button className="btn ghost" type="button" onClick={onClose}>
            Hủy
          </button>
          <button className="btn" type="submit" disabled={saving}>
            {saving ? 'Đang lưu…' : 'Lưu'}
          </button>
        </div>
      </div>
    </form>
  )
}
