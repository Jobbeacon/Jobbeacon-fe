import { useEffect, useId, useRef, useState } from 'react'
import { ChevronRight, List, Search, X } from 'lucide-react'
import { getCategories } from '../api/jobs.api'
import type { CategoryNode } from '../types/job.types'
import styles from './LocationPicker.module.css'
import local from './CategoryPicker.module.css'

type CategoryPickerProps = {
  value: string[]
  onChange: (categories: string[]) => void
}

type CheckState = 'all' | 'some' | 'none'

function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
}

function namesUnder(node: CategoryNode): string[] {
  return [node.name, ...node.children.flatMap(namesUnder)]
}

function stateOf(node: CategoryNode, selected: string[], covered: boolean): CheckState {
  if (covered || selected.includes(node.name)) return 'all'
  if (node.children.length === 0) return 'none'
  const states = node.children.map((child) => stateOf(child, selected, false))
  if (states.every((state) => state === 'all')) return 'all'
  if (states.some((state) => state !== 'none')) return 'some'
  return 'none'
}

function withoutBranch(selected: string[], node: CategoryNode) {
  const drop = new Set(namesUnder(node))
  return selected.filter((name) => !drop.has(name))
}

function contains(node: CategoryNode, target: CategoryNode): boolean {
  return node.id === target.id || node.children.some((child) => contains(child, target))
}

function findCovering(nodes: CategoryNode[], selected: string[], target: CategoryNode): CategoryNode | null {
  for (const node of nodes) {
    if (node.id === target.id || !contains(node, target)) continue
    const closer = findCovering(node.children, selected, target)
    if (closer) return closer
    if (selected.includes(node.name)) return node
  }
  return null
}

function keepExcept(node: CategoryNode, target: CategoryNode): string[] {
  const names: string[] = []
  for (const child of node.children) {
    if (child.id === target.id) continue
    if (contains(child, target)) names.push(...keepExcept(child, target))
    else names.push(child.name)
  }
  return names
}

function excludeCovered(roots: CategoryNode[], selected: string[], target: CategoryNode) {
  const ancestor = findCovering(roots, selected, target)
  if (!ancestor) return selected.filter((name) => name !== target.name)
  return [...selected.filter((name) => name !== ancestor.name), ...keepExcept(ancestor, target)]
}

function nodeMatches(node: CategoryNode, needle: string): boolean {
  if (!needle) return true
  if (fold(node.name).includes(needle)) return true
  return node.children.some((child) => nodeMatches(child, needle))
}

function CheckBox({
  state,
  label,
  onChange,
}: {
  state: CheckState
  label: string
  onChange: () => void
}) {
  const ref = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (ref.current) ref.current.indeterminate = state === 'some'
  }, [state])
  return (
    <input ref={ref} type="checkbox" checked={state === 'all'} aria-label={label} onChange={onChange} />
  )
}

export function CategoryPicker({ value, onChange }: CategoryPickerProps) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const treeRef = useRef<CategoryNode[] | null>(null)
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<string[]>([])
  const [roots, setRoots] = useState<CategoryNode[]>([])
  const [active, setActive] = useState<CategoryNode | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return
    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const loadTree = async () => {
    if (treeRef.current) {
      setRoots(treeRef.current)
      setActive((current) => current ?? treeRef.current?.[0] ?? null)
      return
    }
    setLoading(true)
    setError(null)
    try {
      const items = await getCategories()
      treeRef.current = items
      setRoots(items)
      setActive(items[0] ?? null)
    } catch {
      setError('Không tải được danh mục nghề.')
    } finally {
      setLoading(false)
    }
  }

  const openPanel = () => {
    setDraft(value)
    setQuery('')
    setOpen(true)
    void loadTree()
  }

  const toggle = (node: CategoryNode, covered: boolean) => {
    setDraft((current) => {
      if (covered) return excludeCovered(treeRef.current ?? roots, current, node)
      const state = stateOf(node, current, false)
      const rest = withoutBranch(current, node)
      return state === 'all' ? rest : [...rest, node.name]
    })
  }

  const needle = fold(query.trim())
  const visibleRoots = roots.filter((root) => nodeMatches(root, needle))
  const visibleChildren = (active?.children ?? []).filter((child) => nodeMatches(child, needle))
  const summary =
    value.length === 0 ? '' : value.length <= 2 ? value.join(', ') : `${value.length} ngành`

  return (
    <div className={styles.picker} ref={rootRef}>
      <List aria-hidden="true" />
      <button
        className={styles.trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? setOpen(false) : openPanel())}
      >
        {summary || <span className={styles.placeholder}>Danh mục nghề</span>}
      </button>
      {value.length > 0 ? (
        <button className={styles.clear} type="button" aria-label="Xóa ngành nghề" onClick={() => onChange([])}>
          <X aria-hidden="true" />
        </button>
      ) : null}

      {open ? (
        <div className={`${styles.panel} ${local.panel}`} id={panelId} role="dialog" aria-label="Danh mục nghề">
          <div className={styles.panelHead}>
            <div className={styles.titleRow}>
              <strong>Danh mục nghề</strong>
              <span>Chọn ngành cha, rồi chọn ngành con</span>
            </div>
            <label className={styles.find}>
              <Search aria-hidden="true" />
              <input
                value={query}
                placeholder="Tìm ngành nghề"
                aria-label="Tìm ngành nghề"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>
          {error ? <p className={styles.status}>{error}</p> : null}
          <div className={styles.columns}>
            <ul className={styles.column} aria-label="Ngành cha">
              {loading ? <li className={styles.status}>Đang tải...</li> : null}
              {visibleRoots.map((root) => (
                <li key={root.id} className={active?.id === root.id ? styles.active : undefined}>
                  <label className={styles.check}>
                    <CheckBox
                      state={stateOf(root, draft, false)}
                      label={root.name}
                      onChange={() => toggle(root, false)}
                    />
                  </label>
                  <button type="button" onClick={() => setActive(root)}>
                    {root.name}
                    <ChevronRight aria-hidden="true" />
                  </button>
                </li>
              ))}
              {!loading && visibleRoots.length === 0 ? <li className={styles.status}>Không có kết quả</li> : null}
            </ul>
            <ul className={styles.column} aria-label="Ngành con">
              {!active ? <li className={styles.hint}>Chọn một ngành bên trái</li> : null}
              {active && !loading ? (
                <li>
                  <label className={styles.option}>
                    <CheckBox
                      state={stateOf(active, draft, false)}
                      label={`Tất cả ${active.name}`}
                      onChange={() => toggle(active, false)}
                    />
                    Tất cả {active.name}
                  </label>
                </li>
              ) : null}
              {active
                ? visibleChildren.map((child) => (
                    <ChildRows
                      key={child.id}
                      node={child}
                      selected={draft}
                      covered={stateOf(active, draft, false) === 'all'}
                      onToggle={toggle}
                    />
                  ))
                : null}
            </ul>
          </div>
          <div className={styles.footer}>
            <button type="button" className={styles.reset} onClick={() => setDraft([])}>
              Bỏ chọn tất cả
            </button>
            <button
              type="button"
              className={styles.apply}
              onClick={() => {
                onChange(draft)
                setOpen(false)
              }}
            >
              Áp dụng
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function ChildRows({
  node,
  selected,
  covered,
  onToggle,
}: {
  node: CategoryNode
  selected: string[]
  covered: boolean
  onToggle: (node: CategoryNode, covered: boolean) => void
}) {
  const state = stateOf(node, selected, covered)
  return (
    <li>
      <label className={styles.option}>
        <CheckBox state={state} label={node.name} onChange={() => onToggle(node, covered)} />
        {node.name}
      </label>
      {node.children.length > 0 ? (
        <ul className={local.nested}>
          {node.children.map((child) => (
            <li key={child.id}>
              <label className={styles.option}>
                <CheckBox
                  state={stateOf(child, selected, state === 'all')}
                  label={child.name}
                  onChange={() => onToggle(child, state === 'all')}
                />
                {child.name}
              </label>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}
