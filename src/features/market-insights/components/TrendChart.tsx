import type { TrendPoint } from '../types/market.types'
import { formatCount, formatWeek } from '../utils/market-format'
import { ChartTable } from './ChartTable'
import styles from './MarketCharts.module.css'

type TrendChartProps = {
  points: TrendPoint[]
}

/** New postings per week over the last six months; the latest week and the busiest one are labelled. */
/** The week that is still going on: its count keeps growing until Sunday, so it must not read as a drop. */
function isCurrentWeek(week: string) {
  const start = new Date(`${week}T00:00:00`)
  const days = (Date.now() - start.getTime()) / 86_400_000
  return days >= 0 && days < 7
}

export function TrendChart({ points }: TrendChartProps) {
  const max = Math.max(1, ...points.map((point) => point.jobCount))
  const busiest = points.reduce((best, point, index) => (point.jobCount > points[best].jobCount ? index : best), 0)
  const labelEvery = Math.max(1, Math.ceil(points.length / 8))

  return (
    <section className={styles.card} aria-labelledby="posting-trend-title">
      <header className={styles.cardHead}>
        <h2 id="posting-trend-title">Tin tuyển dụng mới theo tuần</h2>
      </header>

      {points.length === 0 ? (
        <p className={styles.noData}>Chưa có tin nào trong 26 tuần gần nhất.</p>
      ) : (
        <div className={styles.columnChart}>
          <div className={styles.columns}>
            {points.map((point, index) => {
              const labelled = index === points.length - 1 || index === busiest
              const ongoing = isCurrentWeek(point.week)
              return (
                <span
                  key={point.week}
                  className={styles.columnSlot}
                  tabIndex={0}
                  aria-label={`Tuần từ ${formatWeek(point.week)}${ongoing ? ' (chưa hết tuần)' : ''}: ${formatCount(point.jobCount)} tin`}
                >
                  {labelled && <span className={styles.columnValue}>{formatCount(point.jobCount)}</span>}
                  <span
                    className={`${styles.column} ${ongoing ? styles.columnOngoing : ''}`}
                    style={{ height: `${(point.jobCount / max) * 100}%` }}
                  />
                  <span className={styles.tooltip} role="presentation">
                    <strong>{formatCount(point.jobCount)} tin</strong>
                    <span>Tuần từ {formatWeek(point.week)}</span>
                    {ongoing && <span>Tuần này chưa hết, số tin còn tăng</span>}
                  </span>
                </span>
              )
            })}
          </div>
          <div className={styles.columnLabels} aria-hidden="true">
            {points.map((point, index) => (
              <span key={point.week}>{index % labelEvery === 0 ? formatWeek(point.week) : ''}</span>
            ))}
          </div>
        </div>
      )}

      <ChartTable
        caption="Tin tuyển dụng mới theo tuần"
        columns={['Tuần bắt đầu', 'Số tin']}
        rows={points.map((point) => [formatWeek(point.week), formatCount(point.jobCount)])}
      />
    </section>
  )
}
