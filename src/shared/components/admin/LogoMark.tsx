import { useState } from 'react'
import { foldText, initials } from '../../utils/admin-format'

const COMPANY_NOISE =
  /\b(tong cong ty|cong ty|tnhh|mot thanh vien|co phan|cp|tap doan|jsc|corporation|corp|co\.?,? ltd|ltd|viet nam|vietnam|ngan hang tmcp)\b/g

// Bỏ các từ chung ("Công ty", "TNHH"...) để chữ viết tắt ra đúng thương hiệu.
function brandName(name: string) {
  const key = foldText(name.replace(/\(.*?\)/g, ' '))
    .replace(COMPANY_NOISE, ' ')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  return key || name
}

type LogoMarkProps = {
  name: string
  logoUrl?: string | null
  large?: boolean
}

// Logo công ty; chưa có logo (hoặc ảnh lỗi) thì hiện chữ viết tắt.
export function LogoMark({ name, logoUrl, large = false }: LogoMarkProps) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null)
  const size = large ? ' lg' : ''

  if (logoUrl && failedUrl !== logoUrl) {
    return (
      <span className={`logo-mark${size}`}>
        <img alt="" src={logoUrl} loading="lazy" onError={() => setFailedUrl(logoUrl)} />
      </span>
    )
  }
  return (
    <span className={`logo-mark logo-mark--missing${size}`} title="Chưa có logo">
      {initials(brandName(name))}
    </span>
  )
}
