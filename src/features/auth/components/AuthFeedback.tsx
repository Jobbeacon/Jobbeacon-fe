type AuthFeedbackProps = {
  error: string | null
  success: string | null
}

export function AuthFeedback({ error, success }: AuthFeedbackProps) {
  if (error) {
    return (
      <p className="auth-feedback auth-feedback--error" role="alert">
        {error}
      </p>
    )
  }

  if (success) {
    return (
      <p className="auth-feedback auth-feedback--success" role="status">
        {success}
      </p>
    )
  }

  return null
}
