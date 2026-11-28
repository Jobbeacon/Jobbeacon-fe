import { useId } from 'react'
import type { MarketGroup } from '../types/market.types'
import { formatCount, formatMillions, formatMillionsShort, salaryScale } from '../utils/market-format'
import { ChartTable } from './ChartTable'
import styles from './MarketCharts.module.css'

type SalaryRangeChartProps = {
  title: string
  subtitle?: string
  groups: MarketGroup[]
  minSample: number
  /** Clicking a row narrows the whole page to it. */
  onSelect?: (group: MarketGroup) => void
  selectedId?: string | null
}

/**
 * One row per group: the middle half of salaries (p25 to p75) as a band, the median as a dot. Groups with too few
 * salaried jobs keep their row and say so, rather than disappearing.
 */
export function SalaryRangeChart({ title, subtitle, groups, minSample, onSelect, selectedId }: SalaryRangeChartProps) {
  const titleId = useId()
  const maxP75 = Math.max(0, ...groups.map((group) => group.salary.p75 ?? 0))
  // With no salary figure at all, an axis would frame nothing: rows then show job counts only.
  const anySalary = maxP75 > 0
  const { top, ticks: scaleTicks } = salaryScale(maxP75 || 10_000_000)
  const ticks = anySalary ? scaleTicks : []
  const position = (value: number) => `${(value / top) * 100}%`

  return (
    <section className={styles.card} aria-labelledby={titleId}>
      <header className={styles.cardHead}>
        <h2 id={titleId}>{title}</h2>
        {subtitle && <p>{subtitle}</p>}
      </header>

      {groups.length === 0 ? (
        <p className={styles.noData}>Chưa có dữ liệu cho bộ lọc này.</p>
      ) : (
        <div className={styles.rangeChart}>
          {!anySalary && (
            <p className={styles.noData}>
              Chưa nhóm nào có đủ {minSample} tin ghi lương. Dưới đây là số tin của từng nhóm.
            </p>
          )}
          {anySalary && (
            <div className={styles.rangeAxis} aria-hidden="true">
              <span />
              <div className={styles.rangeTicks}>
                {ticks.map((tick) => (
                  <span key={tick} style={{ left: position(tick) }}>
                    {formatMillionsShort(tick)}
                  </span>
                ))}
              </div>
              <span />
            </div>
          )}

          {groups.map((group) => {
            const { p25, median, p75, sampleSize } = group.salary
            const hasSalary = median !== null && p25 !== null && p75 !== null
            const description = hasSalary
              ? `${group.name}: trung vị ${formatMillions(median)}, khoảng giữa ${formatMillions(p25)} đến ${formatMillions(p75)}, ${sampleSize} tin có lương trên ${formatCount(group.jobCount)} tin`
              : `${group.name}: ${formatCount(group.jobCount)} tin, chưa đủ dữ liệu lương (${sampleSize} tin có lương)`
            const RowTag = onSelect ? 'button' : 'div'

            return (
              <RowTag
                key={group.id}
                type={onSelect ? 'button' : undefined}
                className={`${styles.rangeRow} ${selectedId === group.id ? styles.rowSelected : ''}`}
                onClick={onSelect ? () => onSelect(group) : undefined}
                tabIndex={onSelect ? undefined : 0}
                aria-label={description}
              >
                <span className={styles.rowLabel}>
                  <span className={styles.rowName}>{group.name}</span>
                  <span className={styles.rowMeta}>{formatCount(group.jobCount)} tin</span>
                </span>

                <span className={styles.rangeTrack}>
                  {ticks.map((tick) => (
                    <span key={tick} className={styles.gridLine} style={{ left: position(tick) }} />
                  ))}
                  {hasSalary ? (
                    <>
                      <span
                        className={styles.rangeBand}
                        style={{ left: position(p25), width: `calc(${position(p75 - p25)} + 2px)` }}
                      />
                      <span className={styles.rangeMedian} style={{ left: position(median) }} />
                    </>
                  ) : anySalary ? (
                    <span className={styles.rangeMissing}>Chưa đủ dữ liệu lương</span>
                  ) : null}
                </span>

                <span className={styles.rowValue}>{hasSalary ? formatMillions(median) : '—'}</span>

                <span className={styles.tooltip} role="presentation">
                  {hasSalary ? (
                    <>
                      <strong>{formatMillions(median)}</strong>
                      <span>trung vị · {group.name}</span>
                      <span>
                        50% tin ở mức {formatMillions(p25)} – {formatMillions(p75)}
                      </span>
                      <span>
                        {sampleSize} tin có lương / {formatCount(group.jobCount)} tin
                      </span>
                    </>
                  ) : (
                    <>
                      <strong>{formatCount(group.jobCount)} tin</strong>
                      <span>{group.name}</span>
                      <span>
                        Chỉ {sampleSize} tin có lương, cần ít nhất {minSample}
                      </span>
                    </>
                  )}
                </span>
              </RowTag>
            )
          })}
        </div>
      )}

      <ChartTable
        caption={title}
        columns={['Nhóm', 'Số tin', 'Tin có lương', 'P25', 'Trung vị', 'P75']}
        rows={groups.map((group) => [
          group.name,
          formatCount(group.jobCount),
          group.salary.sampleSize,
          formatMillions(group.salary.p25),
          formatMillions(group.salary.median),
          formatMillions(group.salary.p75),
        ])}
      />
    </section>
  )
}
