import { useState } from 'react'
import type { ReactNode } from 'react'
import { PASSWORD_MIN_LENGTH } from '../schemas/auth.schema'

type PasswordFieldProps = {
  id: string
  label: string
  placeholder: string
  autoComplete: string
  headerAction?: ReactNode
  disabled?: boolean
  minLength?: number
}

function EyeIcon({ hidden }: { hidden: boolean }) {
  return hidden ? (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="m3 3 18 18M10.6 10.7a2 2 0 0 0 2.7 2.7M9.9 4.2A10.8 10.8 0 0 1 12 4c5.3 0 9 5 9 5a15.2 15.2 0 0 1-2.1 2.5M6.2 6.2C4.2 7.5 3 9 3 9s3.7 5 9 5c1 0 2-.2 2.8-.5" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 12s3.7-5 9-5 9 5 9 5-3.7 5-9 5-9-5-9-5Z" />
      <circle cx="12" cy="12" r="2.25" />
    </svg>
  )
}

export function PasswordField({
  id,
  label,
  placeholder,
  autoComplete,
  headerAction,
  disabled = false,
  minLength = PASSWORD_MIN_LENGTH,
}: PasswordFieldProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="form-field">
      <div className="form-field__header">
        <label htmlFor={id}>{label}</label>
        {headerAction}
      </div>
      <div className="password-input">
        <input
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          minLength={minLength}
          disabled={disabled}
          required
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
          aria-label={visible ? `Ẩn ${label.toLowerCase()}` : `Hiện ${label.toLowerCase()}`}
        >
          <EyeIcon hidden={!visible} />
        </button>
      </div>
    </div>
  )
}
