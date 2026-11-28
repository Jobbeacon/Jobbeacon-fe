import { useCallback, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Dialog, Pager, SearchInput, StatRow, useConfirm, useToast } from '../../../shared/components/admin'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { fmtNumber } from '../../../shared/utils/admin-format'
import { deleteCompany } from '../api/companies.api'
import { CompanyEditor } from '../components/CompanyEditor'
import { CompanyTable } from '../components/CompanyTable'
import { useCompanyList, useCompanyStats } from '../hooks/useCompanies'
import { COMPANY_SORTS } from '../types/company.types'
import type { CompanyRow, CompanySort } from '../types/company.types'

const PAGE_SIZE = 20

export function CompaniesPage() {
  const confirm = useConfirm()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const rawSort = params.get('sort') as CompanySort | null
  const sort: CompanySort = rawSort && COMPANY_SORTS.includes(rawSort) ? rawSort : 'jobs'
  const page = Math.max(1, Number(params.get('page')) || 1)

  const [version, setVersion] = useState(0)
  const [editingId, setEditingId] = useState<string | null>(null)


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


  const list = useCompanyList({ q, sort, page, size: PAGE_SIZE }, version)
  const stats = useCompanyStats(version)
  const reload = useCallback(() => setVersion((value) => value + 1), [])

  const handleDelete = async (company: CompanyRow) => {
    if (company.jobCount > 0) {
      toast(`Còn ${fmtNumber(company.jobCount)} tin. Gộp công ty này vào công ty khác thay vì xóa.`)
      return
    }
    const ok = await confirm({
      title: 'Gỡ công ty này?',
      copy: `“${company.name}” không còn tin nào và sẽ bị gỡ.`,
      ok: 'Xóa',
      cancel: 'Hủy',
    })
    if (!ok) return
    try {
      await deleteCompany(company.id)
      toast(`Đã gỡ ${company.name}.`)
      reload()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Không gỡ được công ty.')
    }
  }

  return (
    <main className="stage">
      <header className="stage-head">
        <div>
          <h1>Công ty</h1>
          <p className="lead">
            Crawler tạo công ty theo đúng tên ghi trên nguồn, nên một công ty có thể thành nhiều bản. Gộp bản trùng và
            sửa tên, logo ở đây.
          </p>
        </div>
      </header>
      <StatRow
        cards={[
          [stats.data?.total, 'Công ty'],
          [stats.data?.withLogo, 'Có logo'],
          [stats.data?.withoutJobs, 'Không còn tin'],
        ]}
      />
      <section className="sheet">
        <div className="toolbar list-toolbar">
          <SearchInput
            className="search-input"
            placeholder="Tìm tên công ty"
            aria-label="Tìm công ty"
            autoComplete="off"
            value={q}
            onChange={(value) => updateParams({ q: value, page: '' }, true)}
          />
          <select
            aria-label="Sắp xếp"
            value={sort}
            onChange={(event) => updateParams({ sort: event.target.value === 'jobs' ? '' : event.target.value, page: '' })}
          >
            <option value="jobs">Nhiều tin nhất</option>
            <option value="recent">Mới thêm</option>
            <option value="name">Tên A–Z</option>
          </select>
        </div>
        {list.error ? (
          <ErrorState message={list.error} onRetry={reload} />
        ) : (
          <>
            <CompanyTable rows={list.data?.content ?? []} query={q} loading={list.loading} onEdit={setEditingId}
              onDelete={(company) => void handleDelete(company)}
            />
            <Pager
              page={page}
              size={PAGE_SIZE}
              total={list.data?.amount ?? 0}
              unit="công ty"
              onChange={(next) => updateParams({ page: next > 1 ? String(next) : '' })}
            />
          </>
        )}
      </section>

      <Dialog open={editingId !== null} onClose={() => setEditingId(null)} className="modal form-modal">
        {editingId ? <CompanyEditor id={editingId} onClose={() => setEditingId(null)} onChanged={reload} /> : null}
      </Dialog>
    </main>
  )
}
