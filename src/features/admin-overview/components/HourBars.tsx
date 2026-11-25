import { fmtNumber } from '../../../shared/utils/admin-format'
import { pad2 } from './chart'

type HourBarsProps = {
  hours: number[]
  days: number
}

// Phân bổ số lần ghi nhận theo giờ trong ngày (24 cột).
export function HourBars({ hours, days }: HourBarsProps) {
  const values = Array.from({ length: 24 }, (_, hour) => hours[hour] ?? 0)
  const total = values.reduce((count, value) => count + value, 0)
  const peak = Math.max(...values)
  const peakHour = values.indexOf(peak)
  const caption = total
    ? `Phân bổ ${fmtNumber(total)} dòng của ${days} ngày. Đỉnh ${pad2(peakHour)}:00 với ${fmtNumber(peak)} dòng.`
    : `Chưa có ghi nhận trong ${days} ngày.`

  return (
    <div className="split-pane">
      <h2>Khung giờ ghi nhận</h2>
      <div className="hours-wrap">
        <div className="hours">
          {values.map((value, hour) => {
            const label = `${pad2(hour)}:00 · ${fmtNumber(value)} dòng`
            // Giờ cao điểm (≥ 60% đỉnh) tô đậm.
            const hot = peak > 0 && value >= peak * 0.6
            return (
              <span
                key={hour}
                data-hot={hot ? '1' : undefined}
                style={{ height: `${peak ? Math.max(2, (value / peak) * 100) : 2}%` }}
                title={label}
                tabIndex={0}
                role="img"
                aria-label={label}
              />
            )
          })}
        </div>
        <div className="hour-labels">
          {values.map((_, hour) => (
            <span key={hour}>{hour % 3 === 0 ? pad2(hour) : ''}</span>
          ))}
        </div>
      </div>
      <p className="fine">{caption}</p>
    </div>
  )
}
