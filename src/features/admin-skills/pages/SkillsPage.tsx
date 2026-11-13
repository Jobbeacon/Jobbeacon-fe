import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dialog, Pager, SearchInput, StatRow, useConfirm, useToast } from '../../../shared/components/admin'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { fmtNumber } from '../../../shared/utils/admin-format'
import { deleteSkill } from '../api/skills.api'
import { SkillEditor } from '../components/SkillEditor'
import { SkillTable } from '../components/SkillTable'
import { useSkillList, useSkillStats } from '../hooks/useSkills'
import { SKILL_FILTERS, SKILL_SORTS } from '../types/skill.types'
import type { Skill, SkillFilter, SkillSort } from '../types/skill.types'

const PAGE_SIZE = 20

const FILTER_LABEL: [SkillFilter, string][] = [
  ['', 'Tất cả'],
  ['recent', 'Mới 7 ngày'],
  ['noalias', 'Chưa có tên gọi khác'],
  ['unused', 'Chưa gắn tin'],
]

// Modal: null = đóng, 'new' = thêm mới, Skill = sửa.
type Editing = null | 'new' | Skill

export function SkillsPage() {
  const confirm = useConfirm()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const rawSort = params.get('sort') as SkillSort | null
  const sort: SkillSort = rawSort && SKILL_SORTS.includes(rawSort) ? rawSort : 'jobs'
  const rawFilter = (params.get('filter') ?? '') as SkillFilter
  const filter: SkillFilter = SKILL_FILTERS.includes(rawFilter) ? rawFilter : ''
  const page = Math.max(1, Number(params.get('page')) || 1)

  const [version, setVersion] = useState(0)
  const [editing, setEditing] = useState<Editing>(null)


  const updateParams = useCallback(
    (patch: Record<string, string>, replace = false) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(patch).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
          return next
        },
        { replace },
      )
    },
    [setParams],
  )


  const list = useSkillList({ q, filter, sort, page, size: PAGE_SIZE }, version)
  const stats = useSkillStats(version)
  const reload = useCallback(() => setVersion((value) => value + 1), [])

  const handleDelete = async (skill: Skill) => {
    const ok = await confirm({
      title: 'Gỡ kỹ năng này?',
      copy: `“${skill.name}” và tên gọi khác của nó sẽ bị gỡ. ${fmtNumber(skill.jobCount)} tin và ${fmtNumber(skill.cvCount)} CV mất kỹ năng này. Nếu là bản trùng, hãy gộp thay vì gỡ.`,
      ok: 'Xóa',
      cancel: 'Hủy',
    })
    if (!ok) return
    try {
      await deleteSkill(skill.id)
      toast(`Đã gỡ ${skill.name}.`)
      reload()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Không gỡ được kỹ năng.')
    }
  }
  const setFilter = (next: string) => updateParams({ filter: next, page: '' })
  const close = () => setEditing(null)

  return (
    <main className="stage">
      <header className="stage-head">
        <div>
          <h1>Kỹ năng</h1>
          <p className="lead">Crawler tự thêm kỹ năng và gộp tên trùng bằng AI. Bản trùng còn sót thì gộp tay ở đây.</p>
        </div>
        <button className="btn" type="button" onClick={() => setEditing('new')}>
          + Thêm kỹ năng
        </button>
      </header>
      <StatRow
        active={filter}
        onFilter={setFilter}
        cards={[
          [stats.data?.total, 'Kỹ năng', ''],
          [stats.data?.recent, 'Mới 7 ngày', 'recent', 'warn'],
          [stats.data?.withoutAlias, 'Chưa có tên gọi khác', 'noalias'],
          [stats.data?.unused, 'Chưa gắn tin', 'unused'],
        ]}
      />
      <section className="sheet">
        <div className="toolbar skill-toolbar">
          <SearchInput
            className="search-input"
            placeholder="Tìm theo tên hoặc tên gọi khác"
            aria-label="Tìm kỹ năng"
            autoComplete="off"
            value={q}
            onChange={(value) => updateParams({ q: value, page: '' }, true)}
          />
          <div className="switch" role="group" aria-label="Lọc kỹ năng">
            {FILTER_LABEL.map(([value, label]) => (
              <button key={value || 'all'} type="button" aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
          <label className="field sort-field">
            <select
              aria-label="Sắp xếp"
              value={sort}
              onChange={(event) =>
                updateParams({ sort: event.target.value === 'jobs' ? '' : event.target.value, page: '' })
              }
            >
              <option value="jobs">Nhiều tin nhất</option>
              <option value="recent">Mới thêm</option>
              <option value="name">Tên A–Z</option>
            </select>
          </label>
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={reload} />
        ) : (
          <>
            <SkillTable rows={list.data?.content ?? []} query={q} loading={list.loading} onEdit={setEditing}
              onDelete={(skill) => void handleDelete(skill)}
            />
            <Pager
              page={page}
              size={PAGE_SIZE}
              total={list.data?.amount ?? 0}
              unit="kỹ năng"
              onChange={(next) => updateParams({ page: next > 1 ? String(next) : '' })}
            />
          </>
        )}
      </section>

      <Dialog open={editing !== null} onClose={close} className="modal form-modal">
        {editing ? (
          <SkillEditor skill={editing === 'new' ? null : editing} onClose={close} onChanged={reload} />
        ) : null}
      </Dialog>
    </main>
  )
}
