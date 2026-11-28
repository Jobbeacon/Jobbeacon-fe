import styles from './MarketCharts.module.css'

type ChartTableProps = {
  caption: string
  columns: string[]
  rows: (string | number)[][]
}

/** The chart's numbers as a table, folded away by default, so no value depends on hovering. */
export function ChartTable({ caption, columns, rows }: ChartTableProps) {
  if (rows.length === 0) return null
  return (
    <details className={styles.tableView}>
      <summary>Xem dạng bảng</summary>
      <div className={styles.tableScroll}>
        <table>
          <caption className={styles.visuallyHidden}>{caption}</caption>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} scope="col">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </details>
  )
}
