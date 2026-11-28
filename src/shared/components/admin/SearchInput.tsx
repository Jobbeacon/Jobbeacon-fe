import { useEffect, useRef, useState } from 'react'
import type { InputHTMLAttributes } from 'react'

type SearchInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange' | 'type'> & {
  // Giá trị đã áp dụng (thường lấy từ URL).
  value: string
  // Gọi sau khi ngừng gõ `delay` ms (đã trim). Không gọi khi đang ghép chữ bằng bộ gõ (Telex/VNI/IME).
  onChange: (value: string) => void
  delay?: number
}

// Ô tìm kiếm giữ chữ đang gõ trong state cục bộ, chỉ đẩy ra ngoài khi đã ổn định.
// Không gắn thẳng value vào URL: cập nhật URL của router là bất đồng bộ, làm bộ gõ tiếng Việt bị ghi đè giữa chừng.
export function SearchInput({ value, onChange, delay = 300, onKeyDown, ...rest }: SearchInputProps) {
  const [text, setText] = useState(value)
  const [seen, setSeen] = useState(value)
  const [pushed, setPushed] = useState(value)
  const composing = useRef(false)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  // value đổi từ ngoài (back, bấm thẻ thống kê, xóa lọc) → cập nhật ô. Value do chính ô đẩy ra thì bỏ qua.
  if (value !== seen) {
    setSeen(value)
    if (value !== pushed) {
      setPushed(value)
      setText(value)
    }
  }

  useEffect(() => () => clearTimeout(timer.current), [])

  const push = (raw: string) => {
    clearTimeout(timer.current)
    const next = raw.trim()
    setPushed(next)
    if (next !== value) onChange(next)
  }

  const schedule = (raw: string) => {
    clearTimeout(timer.current)
    timer.current = setTimeout(() => push(raw), delay)
  }

  return (
    <input
      {...rest}
      type="search"
      value={text}
      onChange={(event) => {
        setText(event.target.value)
        if (!composing.current) schedule(event.target.value)
      }}
      onCompositionStart={() => {
        composing.current = true
        clearTimeout(timer.current)
      }}
      onCompositionEnd={(event) => {
        composing.current = false
        schedule(event.currentTarget.value)
      }}
      onKeyDown={(event) => {
        if (event.key === 'Enter' && !composing.current) push(event.currentTarget.value)
        onKeyDown?.(event)
      }}
    />
  )
}
