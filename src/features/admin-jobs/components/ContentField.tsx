import { useId, useMemo, useState } from 'react'
import { sanitizeHtml } from '../../../shared/utils/sanitize-html'

type Mode = 'preview' | 'edit'

type ContentFieldProps = {
  label: string
  name: string
  value: string
  onChange: (value: string) => void
  rows?: number
}

// Nội dung crawl về có thể là HTML hoặc text thường.
const looksLikeHtml = (value: string) => /<\/?[a-z][\s\S]*>/i.test(value)

// Ô nội dung dài (mô tả, phúc lợi): 2 chế độ Xem trước (render như trang tìm việc) và Sửa (HTML/text gốc).
export function ContentField({ label, name, value, onChange, rows = 12 }: ContentFieldProps) {
  const [mode, setMode] = useState<Mode>(value.trim() ? 'preview' : 'edit')
  const labelId = useId()
  const panelId = useId()
  const html = useMemo(() => (looksLikeHtml(value) ? sanitizeHtml(value) : null), [value])

  return (
    <div className="field content-field">
      <div className="content-field-head">
        <span id={labelId}>{label}</span>
        <div className="switch" role="tablist" aria-labelledby={labelId}>
          {(['preview', 'edit'] as const).map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={mode === item}
              aria-controls={panelId}
              onClick={() => setMode(item)}
            >
              {item === 'preview' ? 'Xem trước' : 'Sửa'}
            </button>
          ))}
        </div>
      </div>
      <div id={panelId} role="tabpanel">
        {mode === 'edit' ? (
          <textarea
            name={name}
            aria-labelledby={labelId}
            rows={rows}
            value={value}
            onChange={(event) => onChange(event.target.value)}
          />
        ) : !value.trim() ? (
          <p className="content-preview is-empty">Chưa có nội dung.</p>
        ) : html !== null ? (
          <div className="content-preview" dangerouslySetInnerHTML={{ __html: html }} />
        ) : (
          <div className="content-preview is-plain">{value}</div>
        )}
      </div>
    </div>
  )
}
