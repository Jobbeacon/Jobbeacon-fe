import { useId, useRef, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { foldText } from '../../utils/admin-format'
import { useToast } from './toast-context'

type TagInputProps = {
  values: string[]
  onChange: (values: string[]) => void
  // Gợi ý cho datalist
  suggestions?: string[]
  // Chuẩn hóa/kiểm tra giá trị nhập; trả null → không có trong danh sách
  resolve?: (raw: string) => string | null
  placeholder?: string
  ariaLabel?: string
}

const sameText = (a: string, b: string) => foldText(a).trim() === foldText(b).trim()

// Ô nhập dạng nhãn: Enter hoặc dấu phẩy để thêm; chỉ bỏ nhãn bằng nút ×.
// Khung là <div> (không phải <label>): label sẽ chuyển cú bấm vào nút × đầu tiên và tự bỏ nhãn.
export function TagInput({ values, onChange, suggestions, resolve, placeholder, ariaLabel }: TagInputProps) {
  const [draft, setDraft] = useState('')
  const toast = useToast()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)

  const add = (raw: string) => {
    const next = [...values]
    raw
      .split(',')
      .map((part) => part.trim())
      .filter(Boolean)
      .forEach((value) => {
        const known = resolve ? resolve(value) : value
        if (!known) {
          toast(`“${value}” không có trong danh sách.`)
          return
        }
        if (!next.some((item) => sameText(item, known))) {
          next.push(known)
        }
      })
    if (next.length !== values.length) {
      onChange(next)
    }
    setDraft('')
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) {
      return
    }
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      add(draft)
    }
  }

  return (
    // Bấm vào chỗ trống trong khung → focus ô nhập (chuột; bàn phím đã có ô nhập riêng).
    <div
      className="tag-input"
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest('button')) inputRef.current?.focus()
      }}
    >
      <span className="tags">
        {values.map((value, index) => (
          <span key={`${value}-${index}`} className="tag tag--edit">
            {value}
            <button
              type="button"
              aria-label={`Bỏ ${value}`}
              onClick={(event) => {
                event.preventDefault()
                onChange(values.filter((_, i) => i !== index))
              }}
            >
              ×
            </button>
          </span>
        ))}
      </span>
      <input
        ref={inputRef}
        value={draft}
        list={suggestions ? listId : undefined}
        placeholder={placeholder}
        aria-label={ariaLabel}
        autoComplete="off"
        onKeyDown={handleKeyDown}
        onChange={(event) => {
          const native = event.nativeEvent as InputEvent
          // Chọn từ datalist (không có inputType hoặc insertReplacementText) → thêm luôn.
          if (!native.inputType || native.inputType === 'insertReplacementText') {
            add(event.target.value)
          } else {
            setDraft(event.target.value)
          }
        }}
        onBlur={() => {
          if (draft.trim()) {
            add(draft)
          }
        }}
      />
      {suggestions ? (
        <datalist id={listId}>
          {suggestions.map((item) => (
            <option key={item} value={item} />
          ))}
        </datalist>
      ) : null}
    </div>
  )
}
