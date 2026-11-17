type ErrorStateProps = {
  message: string
  onRetry?: () => void
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="error-state" role="alert">
      <span className="error-state__icon" aria-hidden="true">
        !
      </span>
      <div>
        <h2>Không thể tải dữ liệu</h2>
        <p>{message}</p>
        {onRetry ? (
          <button type="button" onClick={onRetry}>
            Thử lại
          </button>
        ) : null}
      </div>
    </div>
  )
}
