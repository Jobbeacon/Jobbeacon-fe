import { useEffect, useId, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark, useConfirm, useToast } from '../../../shared/components/admin'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { fmtNumber, shortDate } from '../../../shared/utils/admin-format'
import {
  getCompany,
  mergeCompany,
  searchCompanies,
  updateCompany,
} from '../api/companies.api'
import type { CompanyDetail, CompanyRef } from '../types/company.types'

type CompanyEditorProps = {
  id: string
  onClose: () => void
  // Gọi sau khi lưu/gộp/xóa thành công để tải lại danh sách + stats
  onChanged: () => void
}

type Loaded = { id: string; detail?: CompanyDetail; error?: string }

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Có lỗi xảy ra.')
const sameName = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase()

// Nội dung modal sửa công ty: tải chi tiết rồi hiện form.
export function CompanyEditor({ id, onClose, onChanged }: CompanyEditorProps) {
  const [loaded, setLoaded] = useState<Loaded | null>(null)

  useEffect(() => {
    const controller = new AbortController()
    getCompany(id, controller.signal)
      .then((detail) => {
        if (!controller.signal.aborted) setLoaded({ id, detail })
      })
      .catch((error: unknown) => {
        if (!controller.signal.aborted) setLoaded({ id, error: errorText(error) })
      })
    return () => controller.abort()
  }, [id])

  const current = loaded?.id === id ? loaded : null
  if (current?.detail) {
    return <CompanyForm key={id} detail={current.detail} onClose={onClose} onChanged={onChanged} />
  }
  return (
    <div>
      <div className="drawer-bar">
        <h2>Công ty</h2>
      </div>
      <div className="drawer-body">
        <p className="fine">{current?.error ?? 'Đang tải…'}</p>
      </div>
      <div className="drawer-actions">
        <button className="btn ghost" type="button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </div>
  )
}

type CompanyFormProps = {
  detail: CompanyDetail
  onClose: () => void
  onChanged: () => void
}

function CompanyForm({ detail, onClose, onChanged }: CompanyFormProps) {
  const toast = useToast()
  const confirm = useConfirm()
  const listId = useId()
  const [name, setName] = useState(detail.name)
  const [logo, setLogo] = useState(detail.logoUrl ?? '')
  const [target, setTarget] = useState('')
  const [found, setFound] = useState<CompanyRef[]>([])
  const [busy, setBusy] = useState(false)
  const term = useDebounce(target.trim(), 300)

  // Gợi ý công ty đích theo chữ đang gõ.
  useEffect(() => {
    if (!term) return
    const controller = new AbortController()
    searchCompanies(term, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setFound(items)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [term])

  // Ứng viên đích = bản nghi trùng + kết quả tìm, bỏ chính nó, không lặp.
  const candidates = useMemo(() => {
    const seen = new Set<string>([detail.id])
    return [...detail.possibleDuplicates, ...(term ? found : [])].filter((item) => {
      if (seen.has(item.id)) return false
      seen.add(item.id)
      return true
    })
  }, [detail, found, term])

  const run = async (action: () => Promise<string>) => {
    setBusy(true)
    try {
      const message = await action()
      toast(message)
      onChanged()
      onClose()
    } catch (error) {
      toast(errorText(error))
      setBusy(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextName = name.trim()
    if (!nextName) return
    void run(async () => {
      await updateCompany(detail.id, { name: nextName, logoUrl: logo.trim() || null })
      return `Đã lưu “${nextName}”.`
    })
  }

  const handleMerge = async () => {
    const chosen = candidates.find((item) => sameName(item.name, target))
    if (!chosen) {
      toast('Chọn một công ty có trong danh sách.')
      return
    }
    const logoNote = chosen.logoUrl === null && detail.logoUrl ? ' Logo cũng được chuyển sang.' : ''
    const ok = await confirm({
      title: `Gộp vào ${chosen.name}?`,
      copy: `${fmtNumber(detail.jobCount)} tin của “${detail.name}” chuyển sang “${chosen.name}”, rồi “${detail.name}” bị gỡ.${logoNote}`,
      ok: 'Gộp',
      cancel: 'Thôi',
    })
    if (!ok) return
    void run(async () => {
      const merged = await mergeCompany(detail.id, chosen.id)
      return `Đã gộp ${fmtNumber(detail.jobCount)} tin vào “${merged.name || chosen.name}”.`
    })
  }


  const twins = detail.possibleDuplicates

  return (
    <form spellCheck={false} onSubmit={handleSubmit} aria-labelledby="company-editor-title">
      <div className="drawer-bar">
        <div className="identity">
          <LogoMark name={name.trim() || 'Công ty'} logoUrl={logo.trim() || null} large />
          <div>
            <h2 id="company-editor-title">{name.trim() || 'Công ty'}</h2>
            <Link className="pill-link" to={`/jobs?company_id=${encodeURIComponent(detail.id)}`} onClick={onClose}>
              Xem tin của công ty
            </Link>
          </div>
        </div>
      </div>
      <div className="drawer-body">
        <label className="field">
          <span>Tên công ty</span>
          <input name="name" required maxLength={255} value={name} onChange={(event) => setName(event.target.value)} />
        </label>
        <label className="field">
          <span>URL logo</span>
          <input
            name="logo"
            type="url"
            placeholder="https://"
            value={logo}
            onChange={(event) => setLogo(event.target.value)}
          />
        </label>
        <dl className="meta">
          <div>
            <dt>Tin</dt>
            <dd>
              {fmtNumber(detail.jobCount)} tin · {fmtNumber(detail.openJobCount)} đang tuyển
            </dd>
          </div>
          <div>
            <dt>Địa điểm</dt>
            <dd>{detail.locations.length ? detail.locations.join(', ') : '—'}</dd>
          </div>
          <div>
            <dt>Nguồn</dt>
            <dd>{detail.sources.length ? detail.sources.join(', ') : '—'}</dd>
          </div>
          <div>
            <dt>Tạo lúc</dt>
            <dd>{shortDate(detail.createdAt)}</dd>
          </div>
        </dl>
        <p className="fine">Địa điểm, số việc đang tuyển và nguồn tính từ các tin của công ty.</p>
        <div className="merge">
          <p className="block-title">Gộp bản trùng</p>
          <p className="fine">
            {twins.length ? (
              <>
                Có thể trùng với:{' '}
                {twins.map((twin, index) => (
                  <span key={twin.id}>
                    {index ? ', ' : null}
                    <button
                      className="linkish"
                      type="button"
                      title="Chọn làm công ty đích"
                      onClick={() => setTarget(twin.name)}
                    >
                      <b>{twin.name}</b> ({fmtNumber(twin.jobCount)} tin)
                    </button>
                  </span>
                ))}
                .
              </>
            ) : (
              'Không thấy tên nào giống.'
            )}
          </p>
          <div className="merge-row">
            <input
              name="target"
              list={listId}
              placeholder="Gộp vào công ty…"
              aria-label="Công ty đích"
              autoComplete="off"
              value={target}
              onChange={(event) => setTarget(event.target.value)}
            />
            <button className="btn ghost" type="button" disabled={busy} onClick={() => void handleMerge()}>
              Gộp
            </button>
          </div>
          <datalist id={listId}>
            {candidates.map((item) => (
              <option key={item.id} value={item.name}>
                {`${fmtNumber(item.jobCount)} tin`}
              </option>
            ))}
          </datalist>
        </div>
      </div>
      <div className="drawer-actions">
        <button className="btn ghost" type="button" onClick={onClose}>
          Hủy
        </button>
        <button className="btn" type="submit" disabled={busy}>
          Lưu
        </button>
      </div>
    </form>
  )
}
