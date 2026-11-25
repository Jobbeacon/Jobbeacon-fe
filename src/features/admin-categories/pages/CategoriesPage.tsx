import { useEffect, useRef, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { StatRow, useConfirm, useToast } from '../../../shared/components/admin'
import type { StatCard } from '../../../shared/components/admin'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { fmtNumber, foldText } from '../../../shared/utils/admin-format'
import { createCategory, deleteCategory, updateCategory } from '../api/categories.api'
import { CategoryColumn } from '../components/CategoryColumn'
import { CategoryEditor } from '../components/CategoryEditor'
import type { CategoryDraft } from '../components/CategoryEditor'
import { CategorySearchResults } from '../components/CategorySearchResults'
import { useCategoryTree } from '../hooks/useCategoryTree'
import { LEVEL_LABEL } from '../types/category.types'
import type { CategoryIndex } from '../types/category.types'

// Mở sẵn nhánh này khi vào trang (nếu có), không thì nhóm đầu tiên.
const DEFAULT_ROOT = foldText('Công nghệ Thông tin')

function errorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError || error instanceof Error ? error.message : fallback
}

// Mục đang mở ở cột 1 & 2. null = chưa chọn gì → dùng nhánh mặc định.
type Browse = { l1: string; l2: string } | null

function resolveBrowse(index: CategoryIndex | null, browse: Browse) {
  if (!index) {
    return { l1: '', l2: '' }
  }
  if (browse === null) {
    const root = index.roots.find((item) => foldText(item.name) === DEFAULT_ROOT) ?? index.roots[0]
    return { l1: root?.id ?? '', l2: root?.children?.[0]?.id ?? '' }
  }
  // Mục đã bị xóa → bỏ chọn.
  const l1 = index.byId.has(browse.l1) ? browse.l1 : ''
  const l2 = l1 && index.byId.get(browse.l2)?.parentId === l1 ? browse.l2 : ''
  return { l1, l2 }
}

export function CategoriesPage() {
  const toast = useToast()
  const confirm = useConfirm()
  const { index, error, reload } = useCategoryTree()
  const [browse, setBrowse] = useState<Browse>(null)
  const [flash, setFlash] = useState('')
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 150)
  const [draft, setDraft] = useState<CategoryDraft | null>(null)
  const [saving, setSaving] = useState(false)
  const columnsRef = useRef<HTMLDivElement>(null)

  const searching = debouncedQuery.trim() !== '' && query.trim() !== ''
  const { l1, l2 } = resolveBrowse(index, browse)
  const node1 = l1 ? (index?.byId.get(l1)?.node ?? null) : null
  const node2 = l2 ? (index?.byId.get(l2)?.node ?? null) : null

  // Cuộn mục đang mở / vừa lưu vào tầm nhìn.
  useEffect(() => {
    columnsRef.current
      ?.querySelectorAll('.is-open, .is-flash')
      .forEach((row) => row.scrollIntoView({ block: 'nearest' }))
  }, [index, l1, l2, flash, searching])

  const openNode = (id: string) => {
    const entry = index?.byId.get(id)
    if (!entry) {
      return
    }
    setFlash('')
    if (entry.path.length === 1) {
      setBrowse({ l1: id, l2: '' })
    } else {
      setBrowse({ l1, l2: id })
    }
  }

  // Mở nhánh chứa mục, bỏ ô tìm, tô vàng mục đó.
  const reveal = (id: string, source: CategoryIndex | null = index) => {
    const path = source?.byId.get(id)?.path ?? []
    setBrowse({ l1: path[0]?.id ?? '', l2: path[1]?.id ?? '' })
    setFlash(id)
    setQuery('')
  }

  const openEditor = (id: string) => {
    const entry = index?.byId.get(id)
    if (entry) {
      setDraft({ category: entry.node, parentPath: entry.path.slice(0, -1) })
    }
  }

  const openCreate = (parentId: string) => {
    const parentPath = parentId ? (index?.byId.get(parentId)?.path ?? []) : []
    setDraft({ category: null, parentPath })
  }

  const handleSave = async (name: string) => {
    if (!draft) {
      return
    }
    const parentId = draft.parentPath.at(-1)?.id ?? ''
    setSaving(true)
    try {
      const saved = draft.category
        ? await updateCategory(draft.category.id, name)
        : await createCategory({ name, parentId: parentId || null })
      setDraft(null)
      toast(`Đã lưu “${name}”.`)
      const next = await reload()
      // Lấy id từ response; BE không trả thì tìm theo tên trong cùng cha.
      let id = draft.category?.id ?? saved?.id ?? ''
      if (next && !next.byId.has(id)) {
        const siblings = parentId ? (next.byId.get(parentId)?.node.children ?? []) : next.roots
        id = siblings.find((item) => foldText(item.name) === foldText(name))?.id ?? ''
      }
      if (!next) {
        toast('Đã lưu nhưng không tải lại được danh mục. Tải lại trang để xem.')
      } else if (id) {
        reveal(id, next)
      }
    } catch (err) {
      toast(errorMessage(err, 'Không lưu được danh mục.'))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    const category = draft?.category
    if (!category) {
      return
    }
    const kids = category.children?.length ?? 0
    if (kids) {
      toast(`Còn ${fmtNumber(kids)} mục con. Gỡ những mục đó trước.`)
      return
    }
    const ok = await confirm({
      title: 'Gỡ danh mục này?',
      copy: `“${category.name}” sẽ bị gỡ khỏi danh sách. ${fmtNumber(category.jobCount)} tin đang gán sẽ không còn danh mục này.`,
      ok: 'Xóa',
      cancel: 'Giữ lại',
    })
    if (!ok) {
      return
    }
    setSaving(true)
    try {
      await deleteCategory(category.id)
      setDraft(null)
      toast(`Đã gỡ ${category.name}.`)
      await reload()
    } catch (err) {
      toast(errorMessage(err, 'Không xóa được danh mục.'))
    } finally {
      setSaving(false)
    }
  }

  const stats: StatCard[] = LEVEL_LABEL.map((label, level) => [index ? index.levelCounts[level] : null, label])
  const total = index ? index.byId.size : null

  return (
    <main className="stage">
      <header className="stage-head">
        <div>
          <h1>Danh mục ngành</h1>
          <p className="lead">Cây ngành nghề 3 cấp dùng để phân loại tin. Crawler gán tin vào cấp vị trí.</p>
        </div>
        <button className="btn" type="button" disabled={!index} onClick={() => openCreate('')}>
          + Thêm nhóm ngành
        </button>
      </header>
      <StatRow cards={stats} />
      <section className="sheet browser">
        <div className="panel-search">
          <input
            type="search"
            placeholder={`Tìm trong ${total === null ? '' : `${fmtNumber(total)} `}danh mục, ví dụ: tester, kế toán, logistics`}
            aria-label="Tìm danh mục"
            autoComplete="off"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        {!index ? (
          error ? (
            <ErrorState message={error} onRetry={() => void reload()} />
          ) : (
            <LoadingState label="Đang tải danh mục..." />
          )
        ) : searching ? (
          <CategorySearchResults index={index} query={debouncedQuery} onReveal={(id) => reveal(id)} />
        ) : (
          <div className="columns" ref={columnsRef}>
            <CategoryColumn
              level={0}
              parent={null}
              items={index.roots}
              selectedId={l1}
              flashId={flash}
              onOpen={openNode}
              onEdit={openEditor}
              onAdd={openCreate}
            />
            <CategoryColumn
              level={1}
              parent={node1}
              items={node1?.children ?? []}
              selectedId={l2}
              flashId={flash}
              onOpen={openNode}
              onEdit={openEditor}
              onAdd={openCreate}
            />
            <CategoryColumn
              level={2}
              parent={node2}
              items={node2?.children ?? []}
              selectedId=""
              flashId={flash}
              onOpen={openNode}
              onEdit={openEditor}
              onAdd={openCreate}
            />
          </div>
        )}
      </section>
      <CategoryEditor
        draft={draft}
        saving={saving}
        onClose={() => setDraft(null)}
        onSave={(name) => void handleSave(name)}
        onDelete={() => void handleDelete()}
      />
    </main>
  )
}
