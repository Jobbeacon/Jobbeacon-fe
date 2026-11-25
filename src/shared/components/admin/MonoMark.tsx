import { useState } from 'react'
import { initials, swatch } from '../../utils/admin-format'

type MonoMarkProps = {
  name: string
  avatarUrl?: string | null
  large?: boolean
}

// Avatar chữ cái (màu theo tên); có ảnh thì hiện ảnh.
export function MonoMark({ name, avatarUrl, large = false }: MonoMarkProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const showImage = Boolean(avatarUrl) && failedUrl !== avatarUrl

  return (
    <span className={`mono-mark${large ? ' lg' : ''}`} style={{ background: swatch(name) }}>
      {showImage ? (
        <img alt="" src={avatarUrl ?? undefined} referrerPolicy="no-referrer" onError={() => setFailedUrl(avatarUrl ?? null)} />
      ) : (
        initials(name)
      )}
    </span>
  )
}
