import { useId, useState } from 'react'
import type { KeyboardEvent } from 'react'
import { Search } from 'lucide-react'
import styles from './Combobox.module.css'

export type ComboboxOption = {
  id: string
  name: string
}

type ComboboxProps = {
  id?: string
  value: string
  onValueChange: (value: string) => void
  options: ComboboxOption[]
  onSelect: (option: ComboboxOption) => void
  /** Hiển thị thay cho danh sách khi không có lựa chọn (đang tải, lỗi, rỗng). */
  status?: string | null
  isError?: boolean
  placeholder: string
  ariaLabel?: string
  disabled?: boolean
  /** Mở danh sách ngay khi focus, kể cả khi chưa gõ. */
  openWhenEmpty?: boolean
  compact?: boolean
}

export function Combobox({
  id,
  value,
  onValueChange,
  options,
  onSelect,
  status = null,
  isError = false,
  placeholder,
  ariaLabel,
  disabled = false,
  openWhenEmpty = false,
  compact = false,
}: ComboboxProps) {
  const listId = useId()
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  const active = Math.min(activeIndex, options.length - 1)
  const showList = isOpen && (openWhenEmpty || value.trim() !== '')
  const optionId = (index: number) => `${listId}-${index}`

  const select = (option: ComboboxOption) => {
    setActiveIndex(0)
    onSelect(option)
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      setIsOpen(true)
      if (options.length === 0) return
      const step = event.key === 'ArrowDown' ? 1 : -1
      const next = (active + step + options.length) % options.length
      setActiveIndex(next)
      document.getElementById(optionId(next))?.scrollIntoView({ block: 'nearest' })
    } else if (event.key === 'Enter') {
      event.preventDefault()
      if (showList && options[active]) select(options[active])
    } else if (event.key === 'Escape') {
      setIsOpen(false)
    }
  }

  return (
    <div className={compact ? `${styles.combobox} ${styles.compact}` : styles.combobox}>
      <label className={styles.inputWrap}>
        <Search aria-hidden="true" />
        <input
          id={id}
          role="combobox"
          aria-label={ariaLabel}
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList && options[active] ? optionId(active) : undefined}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          onChange={(event) => {
            onValueChange(event.target.value)
            setActiveIndex(0)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          onClick={() => setIsOpen(true)}
          onBlur={() => setIsOpen(false)}
          onKeyDown={handleKeyDown}
        />
      </label>

      {showList ? (
        // Danh sách luôn nằm dưới ô nhập, không đè lên vị trí con trỏ khi vừa bấm mở.
        <div className={styles.popover}>
          {options.length > 0 ? (
            <ul id={listId} role="listbox" className={styles.list}>
              {options.map((option, index) => (
                <li
                  key={option.id}
                  id={optionId(index)}
                  role="option"
                  aria-selected={index === active}
                  className={index === active ? `${styles.option} ${styles.optionActive}` : styles.option}
                  // Giữ focus ở ô nhập khi chọn bằng chuột.
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => select(option)}
                >
                  {option.name}
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} className={isError ? `${styles.status} ${styles.statusError}` : styles.status} role="status">
              {status}
            </p>
          )}
        </div>
      ) : null}
    </div>
  )
}
