import { useMemo, useState } from 'react'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { fmtNumber, sourceLabel } from '../../../shared/utils/admin-format'
import { buildDayRows, buildMonthRows, dayLabel, sourceSummary } from '../components/chart'
import { CrawlChart } from '../components/CrawlChart'
import type { ChartRange } from '../components/CrawlChart'
import { HourBars } from '../components/HourBars'
import { KpiBand } from '../components/KpiBand'
import { PlatformShare } from '../components/PlatformShare'
import { RecentCrawls } from '../components/RecentCrawls'
import { useOverview } from '../hooks/useOverview'
import type { ChartRow } from '../types/overview.types'
import '../overview.css'

const DAYS = 30

function average(rows: ChartRow[]) {
  return rows.length ? rows.reduce((total, row) => total + row.total, 0) / rows.length : 0
}

function peakOf(rows: ChartRow[]) {
  return rows.reduce<ChartRow | null>((best, row) => (!best || row.total > best.total ? row : best), null)
}

// Trang tổng quan vận hành crawl.
export function OverviewPage() {
  const { data, error, loading, retry } = useOverview(DAYS)
  const [range, setRange] = useState<ChartRange>('day')

  const dayRows = useMemo(() => (data ? buildDayRows(data.daily) : []), [data])
  const monthRows = useMemo(() => (data ? buildMonthRows(data.monthly, data.today) : []), [data])

  const header = (
    <header className="stage-head">
      <div>
        <h1>Vận hành crawl</h1>
        <p className="lead">
          Mỗi dòng là một lần ghi nhận tin trên một nguồn. Cùng một tin ở hai nguồn được tính hai lần.
        </p>
      </div>
    </header>
  )

  if (!data) {
    return (
      <main className="stage">
        {header}
        {error ? <ErrorState message={error} onRetry={retry} /> : <LoadingState label="Đang tải số liệu crawl..." />}
      </main>
    )
  }

  const sources = data.sources
  const rows = range === 'day' ? dayRows : monthRows
  const peak = peakOf(rows)

  let title: string
  let read = ''
  let caption: string
  if (range === 'day') {
    title = `${dayRows.length} ngày gần nhất`
    if (peak) {
      const weekday = dayRows.filter((row) => !row.weekend)
      const weekend = dayRows.filter((row) => row.weekend)
      read = `Chiều cao là tổng các nguồn. Đỉnh ${peak.label} với ${fmtNumber(peak.total)} dòng.`
      if (weekday.length && weekend.length) {
        read += ` Ngày thường trung bình ${fmtNumber(Math.round(average(weekday)))} dòng, cuối tuần ${fmtNumber(Math.round(average(weekend)))}.`
      }
    }
    caption = dayRows.length
      ? `${dayRows.length} ngày · ${dayRows[0].label}–${dayRows.at(-1)?.label}`
      : `${DAYS} ngày`
  } else {
    title = `${monthRows.length} tháng gần nhất`
    const partial = monthRows.find((row) => row.partial)
    if (peak) {
      read = `${peak.label} cao nhất: ${sourceSummary(peak, sources, ' và ')}, cộng ${fmtNumber(peak.total)} dòng.`
      if (partial) {
        read += ` ${partial.label} chỉ tính đến ${dayLabel(data.today)}.`
      }
    }
    caption = `${monthRows.length} tháng${partial ? ` · ${partial.label} tính đến ${dayLabel(data.today)}` : ''}`
  }

  // Nguồn chưa có ghi nhận hôm nay.
  const quiet = data.quietSources.map((domain) => `${sourceLabel(domain)} hôm nay chưa có ghi nhận.`).join(' ')

  return (
    <main className="stage" aria-busy={loading}>
      {header}
      {quiet ? <p className="notice">{quiet}</p> : null}
      {error ? <ErrorState message={error} onRetry={retry} /> : null}
      <div className="stack">
        <section className="sheet">
          <KpiBand overview={data} dayRows={dayRows} days={dayRows.length || DAYS} />
          <CrawlChart
            range={range}
            onRangeChange={setRange}
            rows={rows}
            sources={sources}
            title={title}
            read={read}
          />
        </section>
        <section className="sheet split-sheet">
          <PlatformShare rows={rows} sources={sources} caption={caption} />
          <HourBars hours={data.hours} days={dayRows.length || DAYS} />
        </section>
        <RecentCrawls rows={data.recent} />
      </div>
    </main>
  )
}
