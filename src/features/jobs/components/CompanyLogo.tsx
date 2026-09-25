import { useState } from 'react'
import { getInitials } from '../../../shared/utils/format'

type CompanyLogoProps = {
  name: string
  logoUrl: string | null
  className: string
}

export function CompanyLogo({ name, logoUrl, className }: CompanyLogoProps) {
  const [hasError, setHasError] = useState(false)

  if (logoUrl && !hasError) {
    return (
      <span className={className} data-has-image="true">
        <img src={logoUrl} alt={name} loading="lazy" onError={() => setHasError(true)} />
      </span>
    )
  }

  return (
    <span className={className} aria-hidden="true">
      {getInitials(name)}
    </span>
  )
}
