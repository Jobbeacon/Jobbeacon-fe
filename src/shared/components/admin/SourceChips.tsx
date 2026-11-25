import { Link } from 'react-router-dom'

type SourceChipsProps = {
  domains: string[]
  // Có thì mỗi chip là link (vd. domain => `/jobs?source=${domain}`)
  to?: (domain: string) => string
}

export function SourceChips({ domains, to }: SourceChipsProps) {
  if (!domains.length) {
    return <span className="empty">—</span>
  }
  return (
    <>
      {domains.map((domain) =>
        to ? (
          <Link key={domain} className="chip chip-link" to={to(domain)}>
            <i data-domain={domain} />
            {domain}
          </Link>
        ) : (
          <span key={domain} className="chip">
            <i data-domain={domain} />
            {domain}
          </span>
        ),
      )}
    </>
  )
}
