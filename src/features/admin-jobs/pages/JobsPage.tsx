import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Pager, SearchInput, StatRow, useConfirm, useToast } from '../../../shared/components/admin'
import type { StatCard } from '../../../shared/components/admin'
import { EMPLOYMENT_LABEL } from '../../../shared/utils/admin-format'
import { deleteJob, getJobStats, listJobs } from '../api/admin-jobs.api'
import { JobEditor } from '../components/JobEditor'
import { JobTable } from '../components/JobTable'
import { useLoad } from '../hooks/useLoad'
import type { JobCrawled, JobQuery, JobRow, JobSort, JobStatus } from '../types/admin-job.types'

const PAGE_SIZE = 20
const SOURCES = ['topcv.vn', 'itviec.com']
const SORTS: [JobSort, string][] = [
  ['new', 'Crawl mới nhất'],
  ['old', 'Crawl cũ nhất'],
  ['expiring', 'Sắp hết hạn'],
  ['salary', 'Lương cao nhất'],
]

const asCrawled = (value: string | null): JobCrawled => (value === 'today' || value === 'month' ? value : '')
const asStatus = (value: string | null): JobStatus => (value === 'open' || value === 'expired' ? value : '')
const asSort = (value: string | null): JobSort => SORTS.find(([key]) => key === value)?.[0] ?? 'new'

type ParamChanges = Record<string, string | null>

export function JobsPage() {
  const confirm = useConfirm()
  const toast = useToast()
  const [params, setParams] = useSearchParams()
  const [reloadKey, setReloadKey] = useState(0)

  // Bộ lọc lấy từ URL để link từ trang khác hoạt động
  const q = params.get('q') ?? ''
  const source = params.get('source') ?? ''
  const employmentType = params.get('employment_type') ?? ''
  const companyId = params.get('company_id') ?? ''
  const crawled = asCrawled(params.get('crawled'))
  const status = asStatus(params.get('status'))
  const sort = asSort(params.get('sort'))
  const page = Math.max(1, Number(params.get('page')) || 1)
  const jobId = params.get('job')


  const update = useCallback(
    (changes: ParamChanges, { resetPage = true, replace = false } = {}) => {
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          Object.entries(changes).forEach(([key, value]) => {
            if (value) {
              next.set(key, value)
            } else {
              next.delete(key)
            }
          })
          if (resetPage) {
            next.delete('page')
          }
          return next
        },
        { replace },
      )
    },
    [setParams],
  )

  const query = useMemo<JobQuery>(
    () => ({ q, source, employmentType, companyId, crawled, status, sort, page, size: PAGE_SIZE }),
    [q, source, employmentType, companyId, crawled, status, sort, page],
  )
  const loadJobs = useCallback((signal: AbortSignal) => listJobs(query, signal), [query])
  const list = useLoad(loadJobs, reloadKey)
  const stats = useLoad(getJobStats, reloadKey).data

  // Trang vượt quá tổng (vd. sau khi xóa tin cuối trang) → lùi về trang cuối
  const amount = list.data?.amount ?? 0
  const lastPage = Math.max(1, Math.ceil(amount / PAGE_SIZE))
  useEffect(() => {
    if (!list.loading && list.data && page > lastPage) {
      update({ page: lastPage > 1 ? String(lastPage) : null }, { resetPage: false, replace: true })
    }
  }, [list.loading, list.data, page, lastPage, update])

  const rows = list.data?.content
  const companyName = companyId ? rows?.find((row) => row.companyId === companyId)?.companyName : undefined

  const scopeBits: string[] = []
  if (companyId) scopeBits.push(`Công ty: ${companyName ?? 'đã chọn'}`)
  if (crawled === 'today') scopeBits.push('Ghi nhận hôm nay')
  if (crawled === 'month') scopeBits.push('Ghi nhận tháng này')

  const sourceOptions = source && !SOURCES.includes(source) ? [...SOURCES, source] : SOURCES

  const cards: StatCard[] = [
    [stats?.total, 'Tất cả tin', ''],
    [stats?.open, 'Còn hạn', 'open'],
    [stats?.expired, 'Hết hạn', 'expired'],
    [stats?.crawledToday, 'Crawl hôm nay', 'today'],
  ]
  const activeStat = crawled === 'today' && !status ? 'today' : status

  const handleStat = (filter: string) => {
    if (filter === 'today') {
      update({ crawled: 'today', status: null })
    } else if (filter) {
      update({ status: filter })
    } else {
      update({ status: null, crawled: null })
    }
  }

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])
  const closeJob = useCallback(() => update({ job: null }, { resetPage: false }), [update])
  const handleChanged = useCallback(() => {
    closeJob()
    reload()
  }, [closeJob, reload])

  const handleDelete = async (job: JobRow) => {
    const title = job.title || 'Tin này'
    const ok = await confirm({
      title: 'Gỡ tin này?',
      copy: `“${title}” sẽ bị gỡ khỏi trang tìm việc và chỉ mục tìm kiếm. Lần crawl sau có thể ghi nhận lại nếu tin còn trên nguồn.`,
      ok: 'Xóa',
      cancel: 'Hủy',
    })
    if (!ok) return
    try {
      await deleteJob(job.id)
      toast(`Đã gỡ “${title}”.`)
      reload()
    } catch (error) {
      toast(error instanceof Error ? error.message : 'Không gỡ được tin.')
    }
  }

  return (
    <main className="stage">
      <header className="stage-head">
        <div>
          <h1>Việc làm</h1>
          <p className="lead">
            Tin do crawler đưa về. Sửa khi parse sai, gán lại danh mục hoặc kỹ năng. Nguồn và thời điểm crawl chỉ để xem.
          </p>
        </div>
      </header>
      <StatRow cards={cards} active={activeStat} onFilter={handleStat} />
      <section className="sheet">
        <div className="toolbar list-toolbar">
          <SearchInput
            className="search-input"
            placeholder="Tìm theo tiêu đề, công ty hoặc tỉnh thành"
            aria-label="Tìm tin"
            autoComplete="off"
            value={q}
            onChange={(value) => update({ q: value }, { replace: true })}
          />
          <select aria-label="Nguồn" value={source} onChange={(event) => update({ source: event.target.value })}>
            <option value="">Mọi nguồn</option>
            {sourceOptions.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
          <select
            aria-label="Loại hình"
            value={employmentType}
            onChange={(event) => update({ employment_type: event.target.value })}
          >
            <option value="">Mọi loại hình</option>
            {Object.entries(EMPLOYMENT_LABEL).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <select
            aria-label="Sắp xếp"
            value={sort}
            onChange={(event) => update({ sort: event.target.value === 'new' ? null : event.target.value })}
          >
            {SORTS.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
        {scopeBits.length ? (
          <p className="scope">
            {scopeBits.join(' · ')}{' '}
            <button type="button" onClick={() => update({ company_id: null, crawled: null })}>
              Bỏ lọc
            </button>
          </p>
        ) : null}
        <JobTable
          rows={rows}
          loading={list.loading}
          error={list.error}
          onEdit={(id) => update({ job: id }, { resetPage: false })}
          onDelete={(job) => void handleDelete(job)}
        />
        <Pager
          page={page}
          size={PAGE_SIZE}
          total={amount}
          unit="tin"
          onChange={(next) => {
            update({ page: next > 1 ? String(next) : null }, { resetPage: false })
            document.querySelector('.sheet')?.scrollIntoView({ block: 'start', behavior: 'smooth' })
          }}
        />
      </section>
      <JobEditor jobId={jobId} onClose={closeJob} onChanged={handleChanged} />
    </main>
  )
}
