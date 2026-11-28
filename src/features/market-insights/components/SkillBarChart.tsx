import type { MarketGroup } from '../types/market.types'
import { formatCount, formatMillions, formatShare } from '../utils/market-format'
import { ChartTable } from './ChartTable'
import styles from './MarketCharts.module.css'

type SkillBarChartProps = {
  skills: MarketGroup[]
  minSample: number
  selectedId: string | null
  onSelect: (skill: MarketGroup) => void
}

/** Skills by how many jobs ask for them; clicking one narrows the page to jobs that need it. */
export function SkillBarChart({ skills, minSample, selectedId, onSelect }: SkillBarChartProps) {
  const max = Math.max(1, ...skills.map((skill) => skill.jobCount))

  return (
    <section className={styles.card} aria-labelledby="top-skills-title">
      <header className={styles.cardHead}>
        <h2 id="top-skills-title">Kỹ năng được tuyển nhiều nhất</h2>
      </header>

      {skills.length === 0 ? (
        <p className={styles.noData}>Chưa có dữ liệu cho bộ lọc này.</p>
      ) : (
        <div className={styles.barChart}>
          {skills.map((skill) => {
            const median = skill.salary.median
            const salaryText =
              median !== null
                ? `lương trung vị ${formatMillions(median)}`
                : `chưa đủ dữ liệu lương (${skill.salary.sampleSize}/${minSample} tin)`
            return (
              <button
                key={skill.id}
                type="button"
                className={`${styles.barRow} ${selectedId === skill.id ? styles.rowSelected : ''}`}
                onClick={() => onSelect(skill)}
                aria-pressed={selectedId === skill.id}
                aria-label={`${skill.name}: ${formatCount(skill.jobCount)} tin, ${formatShare(skill.share)}, ${salaryText}`}
              >
                <span className={styles.rowName}>{skill.name}</span>
                <span className={styles.barTrack}>
                  <span className={styles.bar} style={{ width: `${(skill.jobCount / max) * 100}%` }} />
                  <span className={styles.barValue} style={{ left: `calc(${(skill.jobCount / max) * 100}% + 8px)` }}>
                    {formatCount(skill.jobCount)} · {formatShare(skill.share)}
                  </span>
                </span>
                <span className={styles.tooltip} role="presentation">
                  <strong>{formatCount(skill.jobCount)} tin</strong>
                  <span>{skill.name}</span>
                  <span>{formatShare(skill.share)} số tin đang xem</span>
                  <span>{median !== null ? `Lương trung vị ${formatMillions(median)}` : 'Chưa đủ dữ liệu lương'}</span>
                </span>
              </button>
            )
          })}
        </div>
      )}

      <ChartTable
        caption="Kỹ năng được tuyển nhiều nhất"
        columns={['Kỹ năng', 'Số tin', 'Tỷ lệ', 'Tin có lương', 'Lương trung vị']}
        rows={skills.map((skill) => [
          skill.name,
          formatCount(skill.jobCount),
          formatShare(skill.share),
          skill.salary.sampleSize,
          formatMillions(skill.salary.median),
        ])}
      />
    </section>
  )
}
