import { useLayoutEffect, useRef, useState } from 'react'
import type { SVGProps } from 'react'
import { fmtNumber, sourceLabel } from '../../../shared/utils/admin-format'
import type { ChartRow } from '../types/overview.types'
import { CHART_FONT, countOf, roundTop, sourceColor, sourceSummary, ticks } from './chart'

export type ChartRange = 'day' | 'month'

type CrawlChartProps = {
  range: ChartRange
  onRangeChange: (range: ChartRange) => void
  rows: ChartRow[]
  sources: string[]
  title: string
  read: string
}

type Tip = { x: number; y: number; row: ChartRow }

const WIDTH = 960
const HEIGHT = 286

// Trục y: vạch ngang + nhãn số (bỏ nhãn 0).
function Axis({ marks, y, left, right }: { marks: number[]; y: (value: number) => number; left: number; right: number }) {
  return (
    <>
      {marks.map((mark) => (
        <g key={mark}>
          <line x1={left} x2={WIDTH - right} y1={y(mark)} y2={y(mark)} stroke={mark === 0 ? '#e2e8f0' : '#f1f5f9'} />
          {mark === 0 ? null : (
            <text x={left - 10} y={y(mark) + 4} textAnchor="end" fill="#94a3b8" fontFamily={CHART_FONT} fontSize={11}>
              {fmtNumber(mark)}
            </text>
          )}
        </g>
      ))}
    </>
  )
}

// Biểu đồ cột theo nguồn: tab Ngày (cột chồng) / Tháng (cột nhóm), tooltip khi hover/focus.
export function CrawlChart({ range, onRangeChange, rows, sources, title, read }: CrawlChartProps) {
  const plotRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  const [tip, setTip] = useState<Tip | null>(null)

  // Đặt tooltip cạnh con trỏ, lật sang trái khi tràn mép phải.
  useLayoutEffect(() => {
    const plot = plotRef.current
    const node = tipRef.current
    if (!tip || !plot || !node) {
      return
    }
    const bounds = plot.getBoundingClientRect()
    const width = node.offsetWidth
    let left = tip.x - bounds.left + 14
    if (left + width > bounds.width - 8) {
      left = tip.x - bounds.left - width - 14
    }
    node.style.left = `${Math.max(8, left)}px`
    node.style.top = `${Math.max(8, tip.y - bounds.top - 28)}px`
  }, [tip])

  const hitProps = (row: ChartRow): SVGProps<SVGRectElement> => ({
    tabIndex: 0,
    role: 'img',
    'aria-label': `${row.label}: ${sourceSummary(row, sources)}, cộng ${fmtNumber(row.total)}${row.partial ? ', chưa đủ tháng' : ''}`,
    fill: 'transparent',
    onMouseMove: (event) => setTip({ x: event.clientX, y: event.clientY, row }),
    onMouseLeave: () => setTip(null),
    onFocus: (event) => {
      const rect = event.currentTarget.getBoundingClientRect()
      setTip({ x: rect.left + rect.width / 2, y: rect.top, row })
    },
    onBlur: () => setTip(null),
  })

  const changeRange = (next: ChartRange) => {
    setTip(null)
    onRangeChange(next)
  }

  return (
    <>
      <div className="chart-tools">
        <h2>{title}</h2>
        <div className="legend">
          {sources.map((domain, index) => (
            <span key={domain}>
              <i className="swatch" style={{ background: sourceColor(index) }} /> {sourceLabel(domain)}
            </span>
          ))}
        </div>
        <div className="switch" role="tablist">
          <button type="button" role="tab" aria-selected={range === 'day'} onClick={() => changeRange('day')}>
            Ngày
          </button>
          <button type="button" role="tab" aria-selected={range === 'month'} onClick={() => changeRange('month')}>
            Tháng
          </button>
        </div>
      </div>
      <div className="plot-wrap">
        <div className="plot" ref={plotRef}>
          {range === 'day' ? (
            <DayBars rows={rows} sources={sources} hitProps={hitProps} />
          ) : (
            <MonthBars rows={rows} sources={sources} hitProps={hitProps} />
          )}
        </div>
        <div className="tip" ref={tipRef} hidden={!tip}>
          {tip ? (
            <>
              <strong>{tip.row.label}</strong>
              {sources.map((domain) => (
                <span key={domain}>
                  <br />
                  {sourceLabel(domain)} {fmtNumber(countOf(tip.row, domain))}
                </span>
              ))}
              <br />
              Cộng {fmtNumber(tip.row.total)}
              {tip.row.partial ? (
                <>
                  <br />
                  Chưa đủ tháng
                </>
              ) : null}
            </>
          ) : null}
        </div>
      </div>
      <p className="aside">{read}</p>
    </>
  )
}

type BarsProps = {
  rows: ChartRow[]
  sources: string[]
  hitProps: (row: ChartRow) => SVGProps<SVGRectElement>
}

// Cột chồng theo ngày: nguồn đầu ở dưới, bo góc đoạn trên cùng.
function DayBars({ rows, sources, hitProps }: BarsProps) {
  const pad = { l: 48, r: 8, t: 14, b: 28 }
  const { top, marks } = ticks(Math.max(0, ...rows.map((row) => row.total)))
  const innerW = WIDTH - pad.l - pad.r
  const innerH = HEIGHT - pad.t - pad.b
  const step = innerW / Math.max(1, rows.length)
  const barW = Math.min(14, step * 0.52)
  const x = (index: number) => pad.l + step * index + step / 2
  const y = (value: number) => pad.t + innerH - (value / top) * innerH

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
      <title>Số lần ghi nhận theo ngày, xếp chồng theo nguồn</title>
      <Axis marks={marks} y={y} left={pad.l} right={pad.r} />
      {rows.map((row, index) => {
        const bx = x(index) - barW / 2
        const topIndex = sources.reduce((last, domain, i) => (countOf(row, domain) > 0 ? i : last), -1)
        let base = 0
        return (
          <g key={row.key}>
            {sources.map((domain, i) => {
              const value = countOf(row, domain)
              const yBottom = y(base)
              base += value
              const yTop = y(base)
              // Đoạn phía trên chồng nhẹ xuống để không hở khe.
              const overlap = i > 0 ? 0.75 : 0
              const d = roundTop(bx, yTop, barW, yBottom - yTop + overlap, i === topIndex ? 3 : 0)
              return d ? <path key={domain} d={d} fill={sourceColor(i)} /> : null
            })}
          </g>
        )
      })}
      {rows.map((row, index) =>
        index % 5 === 0 || index === rows.length - 1 ? (
          <text key={row.key} x={x(index)} y={HEIGHT - 8} textAnchor="middle" fill="#94a3b8" fontFamily={CHART_FONT} fontSize={11}>
            {row.label}
          </text>
        ) : null,
      )}
      {rows.map((row, index) => (
        <rect key={row.key} x={pad.l + step * index} y={pad.t} width={step} height={innerH} {...hitProps(row)} />
      ))}
    </svg>
  )
}

// Cột nhóm theo tháng: mỗi nguồn một cột cạnh nhau.
function MonthBars({ rows, sources, hitProps }: BarsProps) {
  const pad = { l: 52, r: 12, t: 14, b: 40 }
  const max = Math.max(0, ...rows.flatMap((row) => sources.map((domain) => countOf(row, domain))))
  const { top, marks } = ticks(max)
  const innerW = WIDTH - pad.l - pad.r
  const innerH = HEIGHT - pad.t - pad.b
  const groupW = innerW / Math.max(1, rows.length)
  const gap = 6
  const count = Math.max(1, sources.length)
  const barW = Math.max(4, Math.min(22, (groupW * 0.8 - gap * (count - 1)) / count))
  const y = (value: number) => pad.t + innerH - (value / top) * innerH

  return (
    <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img">
      <title>Số lần ghi nhận theo tháng và nguồn</title>
      <Axis marks={marks} y={y} left={pad.l} right={pad.r} />
      {rows.map((row, index) => {
        const origin = pad.l + index * groupW
        const start = origin + groupW / 2 - (count * barW + (count - 1) * gap) / 2
        return (
          <g key={row.key}>
            {sources.map((domain, i) => {
              const barY = y(countOf(row, domain))
              const d = roundTop(start + i * (barW + gap), barY, barW, Math.max(0, y(0) - barY), 4)
              return d ? <path key={domain} d={d} fill={sourceColor(i)} /> : null
            })}
            <text
              x={origin + groupW / 2}
              y={row.hint ? HEIGHT - 22 : HEIGHT - 10}
              textAnchor="middle"
              fill="#334155"
              fontFamily={CHART_FONT}
              fontSize={13}
              fontWeight={600}
            >
              {row.label}
            </text>
            {row.hint ? (
              <text x={origin + groupW / 2} y={HEIGHT - 8} textAnchor="middle" fill="#94a3b8" fontFamily={CHART_FONT} fontSize={11}>
                {row.hint}
              </text>
            ) : null}
            <rect x={origin} y={pad.t} width={groupW} height={innerH} {...hitProps(row)} />
          </g>
        )
      })}
    </svg>
  )
}
