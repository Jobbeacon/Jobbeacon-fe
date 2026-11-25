import { useEffect, useId, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { TagInput, useConfirm, useToast } from '../../../shared/components/admin'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { fmtNumber, shortDate } from '../../../shared/utils/admin-format'
import { createSkill, mergeSkill, searchSkills, updateSkill } from '../api/skills.api'
import type { Skill } from '../types/skill.types'
import { normalizeName } from '../utils/skill-name'

type SkillEditorProps = {
  // null → thêm mới
  skill: Skill | null
  onClose: () => void
  // Gọi sau khi lưu/gộp/xóa thành công để tải lại danh sách + stats
  onChanged: () => void
}

const errorText = (error: unknown) => (error instanceof Error ? error.message : 'Có lỗi xảy ra.')

// Nội dung modal thêm/sửa kỹ năng (Dialog chỉ render khi mở nên state reset mỗi lần mở).
export function SkillEditor({ skill, onClose, onChanged }: SkillEditorProps) {
  const toast = useToast()
  const confirm = useConfirm()
  const headingId = useId()
  const listId = useId()
  const [name, setName] = useState(skill?.name ?? '')
  const [aliases, setAliases] = useState<string[]>(skill?.aliases ?? [])
  const [target, setTarget] = useState('')
  const [found, setFound] = useState<Skill[]>([])
  const [busy, setBusy] = useState(false)
  const term = useDebounce(target.trim(), 300)
  const key = normalizeName(name)

  // Gợi ý kỹ năng đích theo chữ đang gõ.
  useEffect(() => {
    if (!skill || !term) return
    const controller = new AbortController()
    searchSkills(term, controller.signal)
      .then((items) => {
        if (!controller.signal.aborted) setFound(items)
      })
      .catch(() => undefined)
    return () => controller.abort()
  }, [skill, term])

  const candidates = useMemo(
    () => (term ? found.filter((item) => item.id !== skill?.id) : []),
    [found, term, skill],
  )

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
    // Bỏ alias trùng với tên chính; trùng với kỹ năng khác thì BE trả 409.
    const body = { name: nextName, aliases: aliases.filter((alias) => normalizeName(alias) !== key) }
    void run(async () => {
      if (skill) {
        await updateSkill(skill.id, body)
      } else {
        await createSkill(body)
      }
      return `Đã lưu “${nextName}”.`
    })
  }

  const handleMerge = async () => {
    if (!skill) return
    const wanted = normalizeName(target)
    // Ưu tiên khớp tên, sau đó khớp tên gọi khác.
    const chosen =
      candidates.find((item) => normalizeName(item.name) === wanted) ??
      candidates.find((item) => item.aliases.some((alias) => normalizeName(alias) === wanted))
    if (!wanted || !chosen) {
      toast('Chọn một kỹ năng có trong danh sách.')
      return
    }
    const ok = await confirm({
      title: `Gộp vào ${chosen.name}?`,
      copy: `“${skill.name}” và ${skill.aliases.length} tên gọi khác sẽ thành tên gọi khác của “${chosen.name}”. ${fmtNumber(skill.jobCount)} tin và ${fmtNumber(skill.cvCount)} CV chuyển sang kỹ năng này.`,
      ok: 'Gộp',
      cancel: 'Thôi',
    })
    if (!ok) return
    void run(async () => {
      const merged = await mergeSkill(skill.id, chosen.id)
      return `Đã gộp “${skill.name}” vào “${merged.name || chosen.name}”.`
    })
  }


  return (
    <form spellCheck={false} onSubmit={handleSubmit} aria-labelledby={headingId}>
      <div className="drawer-bar">
        <h2 id={headingId}>{skill ? 'Sửa kỹ năng' : 'Thêm kỹ năng'}</h2>
      </div>
      <div className="drawer-body">
        <label className="field">
          <span>Tên hiển thị</span>
          <input
            name="name"
            required
            maxLength={255}
            autoFocus
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <p className="fine">{key ? `Tên chuẩn: ${key}` : 'Tên chuẩn hiện khi gõ.'}</p>
        <div className="field">
          <span>Tên gọi khác</span>
          <TagInput
            values={aliases}
            onChange={setAliases}
            placeholder="Gõ rồi nhấn Enter"
            ariaLabel="Thêm tên gọi khác"
          />
          <p className="fine">Tin hoặc CV ghi bằng các tên này sẽ được nhận là kỹ năng trên.</p>
        </div>
        {skill ? (
          <>
            <dl className="meta">
              <div>
                <dt>Tin đang dùng</dt>
                <dd>{fmtNumber(skill.jobCount)}</dd>
              </div>
              <div>
                <dt>CV đang dùng</dt>
                <dd>{fmtNumber(skill.cvCount)}</dd>
              </div>
              <div>
                <dt>Thêm lúc</dt>
                <dd>{shortDate(skill.createdAt)}</dd>
              </div>
            </dl>
            <div className="merge">
              <p className="block-title">Gộp bản trùng</p>
              <p className="fine">
                Dùng khi kỹ năng này thực ra là kỹ năng khác viết khác đi. Tên và tên gọi khác của nó sẽ chuyển sang kỹ
                năng đích.
              </p>
              <div className="merge-row">
                <input
                  name="target"
                  list={listId}
                  placeholder="Gộp vào kỹ năng…"
                  aria-label="Kỹ năng đích"
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
          </>
        ) : null}
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
