import { useCallback, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { SourceChips, TagInput, useToast } from '../../../shared/components/admin'
import { useDebounce } from '../../../shared/hooks/useDebounce'
import { EMPLOYMENT_LABEL, PERIOD_LABEL, stamp } from '../../../shared/utils/admin-format'
import {
  getCategoryLeaves,
  getProvinceNames,
  getUserSiteUrl,
  searchCompanies,
  searchSkills,
  updateJob,
} from '../api/admin-jobs.api'
import { useLoad } from '../hooks/useLoad'
import type { JobCategory, JobDetail, NamedRef } from '../types/admin-job.types'
import {
  blankToNull,
  findByName,
  fromDateInput,
  readSalaryKeeping,
  salaryInput,
  sameText,
  toDateInput,
} from '../utils/job-form'
import { ContentField } from './ContentField'

type JobFormProps = {
  job: JobDetail
  onClose: () => void
  // Sau khi lưu/xóa thành công: đóng drawer + tải lại danh sách
  onChanged: () => void
}

const NO_REFS: NamedRef[] = []

const loadCategoryLeaves = (signal: AbortSignal) => getCategoryLeaves(signal)
const loadProvinces = (signal: AbortSignal) => getProvinceNames(signal)

const errorMessage = (error: unknown) =>
  error instanceof ApiError || error instanceof Error ? error.message : 'Có lỗi xảy ra, thử lại sau.'

const pathText = (category: JobCategory) => (category.path?.length ? category.path : [category.name]).join(' › ')

export function JobForm({ job, onClose, onChanged }: JobFormProps) {
  const toast = useToast()
  const [busy, setBusy] = useState(false)

  const [title, setTitle] = useState(job.title ?? '')
  const [companyName, setCompanyName] = useState(job.companyName ?? '')
  const [employmentType, setEmploymentType] = useState(job.employmentType ?? '')
  const [experience, setExperience] = useState(job.experienceMonths == null ? '' : String(job.experienceMonths))
  const [locations, setLocations] = useState<string[]>(job.locations ?? [])
  const [categories, setCategories] = useState<JobCategory[]>(job.categories ?? [])
  const [skills, setSkills] = useState<NamedRef[]>(job.skills ?? [])
  const [currency, setCurrency] = useState(job.currency || 'VND')
  const [period, setPeriod] = useState(job.salaryPeriod || 'MONTH')
  const [minSalary, setMinSalary] = useState(salaryInput(job.minSalary, job.currency))
  const [maxSalary, setMaxSalary] = useState(salaryInput(job.maxSalary, job.currency))
  const [posted, setPosted] = useState(toDateInput(job.postedDate))
  const [expired, setExpired] = useState(toDateInput(job.expiredDate))
  const [description, setDescription] = useState(job.description ?? '')
  const [benefits, setBenefits] = useState(job.benefits ?? '')
  const [skillQuery, setSkillQuery] = useState('')

  // Gợi ý công ty theo chữ đang gõ
  const companyQuery = useDebounce(companyName.trim(), 300)
  const loadCompanies = useCallback((signal: AbortSignal) => searchCompanies(companyQuery, signal), [companyQuery])
  const companyOptions = useLoad(loadCompanies).data ?? NO_REFS
  const knownCompanies = useMemo(() => {
    const initial = job.companyId && job.companyName ? [{ id: job.companyId, name: job.companyName }] : []
    return [...initial, ...companyOptions]
  }, [job.companyId, job.companyName, companyOptions])

  // Gợi ý kỹ năng theo chữ đang gõ trong ô nhãn
  const debouncedSkillQuery = useDebounce(skillQuery.trim(), 250)
  const loadSkills = useCallback((signal: AbortSignal) => searchSkills(debouncedSkillQuery, signal), [debouncedSkillQuery])
  const skillOptions = useLoad(loadSkills).data ?? NO_REFS

  const leaves = useLoad(loadCategoryLeaves).data
  const provinces = useLoad(loadProvinces).data ?? []

  // Tên vị trí trùng nhau giữa các nhánh → thêm path cha để phân biệt.
  const categoryLabel = useMemo(() => {
    const counts = new Map<string, number>()
    leaves?.forEach((leaf) => counts.set(leaf.name, (counts.get(leaf.name) ?? 0) + 1))
    return (category: JobCategory) =>
      (counts.get(category.name) ?? 0) > 1 && category.path.length > 1
        ? `${category.name} · ${category.path.slice(0, -1).join(' › ')}`
        : category.name
  }, [leaves])

  const categoryPool = useMemo(() => [...categories, ...(leaves ?? [])], [categories, leaves])
  const skillPool = useMemo(() => [...skills, ...skillOptions], [skills, skillOptions])

  const userSiteUrl = getUserSiteUrl()
  const mappings = [...(job.mappings ?? [])].sort((a, b) => (b.crawledAt ?? '').localeCompare(a.crawledAt ?? ''))


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = event.currentTarget
    const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement

    const min = readSalaryKeeping(minSalary, currency, job.minSalary, job.currency)
    const max = readSalaryKeeping(maxSalary, currency, job.maxSalary, job.currency)
    const hint = currency === 'USD' ? 'Nhập số USD, ví dụ 1500.' : 'Nhập số triệu, ví dụ 25 hoặc 25,5.'
    field('min').setCustomValidity(Number.isNaN(min) ? hint : '')
    field('max').setCustomValidity(
      Number.isNaN(max) ? hint : min !== null && max !== null && max < min ? 'Mức trần đang thấp hơn mức sàn.' : '',
    )
    const company = findByName(knownCompanies, companyName, (item) => item.name)
    field('company').setCustomValidity(company ? '' : 'Chọn một công ty có trong danh sách.')
    const exp = experience.trim()
    field('exp').setCustomValidity(exp && !/^\d+$/.test(exp) ? 'Nhập số tháng, ví dụ 12.' : '')
    if (!form.reportValidity() || !company) {
      return
    }

    const hasSalary = min !== null || max !== null
    setBusy(true)
    try {
      const saved = await updateJob(job.id, {
        title: title.trim(),
        companyId: company.id,
        employmentType: employmentType || null,
        experienceMonths: exp ? Number(exp) : null,
        categoryIds: categories.map((item) => item.id),
        skillIds: skills.map((item) => item.id),
        locations,
        minSalary: min,
        maxSalary: max,
        currency: hasSalary ? currency : null,
        salaryPeriod: hasSalary ? period : null,
        postedDate: fromDateInput(posted, job.postedDate),
        expiredDate: fromDateInput(expired, job.expiredDate),
        description: blankToNull(description),
        benefits: blankToNull(benefits),
      })
      toast(`Đã lưu “${saved?.title ?? title.trim()}”.`)
      onChanged()
    } catch (error) {
      toast(errorMessage(error))
      setBusy(false)
    }
  }

  return (
    <form
      spellCheck={false}
      onSubmit={handleSubmit}
      // Sửa ô nào thì xóa lỗi custom của ô đó
      onInput={(event) => {
        const target = event.target as HTMLInputElement
        target.setCustomValidity?.('')
      }}
    >
      <div className="drawer-bar">
        <div>
          <h2 id="job-heading">{job.title || 'Sửa tin'}</h2>
          {userSiteUrl ? (
            <a id="public-job" href={`${userSiteUrl}/jobs/${encodeURIComponent(job.id)}`} target="_blank" rel="noreferrer">
              Xem trên trang tìm việc
            </a>
          ) : null}
        </div>
      </div>
      <div className="drawer-body">
        <p className="block-title">Thông tin chung</p>
        <label className="field">
          <span>Tiêu đề</span>
          <input name="title" required maxLength={255} value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
        </label>
        <label className="field">
          <span>Công ty</span>
          <input
            name="company"
            list="job-company-names"
            required
            maxLength={255}
            autoComplete="off"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />
          <datalist id="job-company-names">
            {companyOptions.map((item) => (
              <option key={item.id} value={item.name} />
            ))}
          </datalist>
        </label>
        <div className="pair">
          <label className="field">
            <span>Loại hình</span>
            <select name="type" value={employmentType} onChange={(e) => setEmploymentType(e.target.value)}>
              <option value="">Chưa rõ</option>
              {Object.entries(EMPLOYMENT_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            <span>Kinh nghiệm</span>
            <span className="unit-field">
              <input
                name="exp"
                inputMode="numeric"
                aria-label="Kinh nghiệm, tháng"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
              />
              <em>tháng</em>
            </span>
          </label>
        </div>
        <div className="field">
          <span>Địa điểm</span>
          <TagInput
            values={locations}
            onChange={setLocations}
            suggestions={provinces}
            // Cho phép giá trị tự do; khớp tên tỉnh thì dùng tên chuẩn
            resolve={(raw) => findByName(provinces, raw, (name) => name) ?? raw.trim()}
            placeholder="Chọn tỉnh thành"
            ariaLabel="Thêm tỉnh thành"
          />
        </div>

        <p className="block-title">Phân loại</p>
        <div className="field">
          <span>Danh mục (cấp vị trí)</span>
          <TagInput
            values={categories.map(categoryLabel)}
            onChange={(labels) =>
              setCategories(
                labels
                  .map((label) => categoryPool.find((item) => categoryLabel(item) === label))
                  .filter((item): item is JobCategory => Boolean(item)),
              )
            }
            suggestions={(leaves ?? []).map(categoryLabel)}
            resolve={(raw) => {
              const match = (leaves ?? []).find((leaf) => sameText(categoryLabel(leaf), raw))
                ?? (leaves ?? []).find((leaf) => sameText(leaf.name, raw))
              return match ? categoryLabel(match) : null
            }}
            placeholder={leaves ? 'Ví dụ: Backend Developer' : 'Đang tải danh mục…'}
            ariaLabel="Thêm danh mục"
          />
        </div>
        <p className="fine path-hint">
          {categories.length
            ? categories.map(pathText).join(' · ')
            : 'Chưa có danh mục. Tin sẽ không hiện khi lọc theo ngành.'}
        </p>
        <div className="field" onInput={(e) => setSkillQuery((e.target as HTMLInputElement).value ?? '')}>
          <span>Kỹ năng</span>
          <TagInput
            values={skills.map((item) => item.name)}
            onChange={(names) =>
              setSkills(
                names
                  .map((name) => findByName(skillPool, name, (item) => item.name))
                  .filter((item): item is NamedRef => Boolean(item)),
              )
            }
            suggestions={skillOptions.map((item) => item.name)}
            resolve={(raw) => findByName(skillPool, raw, (item) => item.name)?.name ?? null}
            placeholder="Chọn kỹ năng"
            ariaLabel="Thêm kỹ năng"
          />
          <p className="fine">Chỉ chọn kỹ năng đã có. Kỹ năng mới thêm ở trang Kỹ năng.</p>
        </div>

        <p className="block-title">Lương và thời hạn</p>
        <div className="field">
          <span>Lương (để trống là thỏa thuận)</span>
          <div className="salary">
            <input
              name="min"
              inputMode="decimal"
              placeholder="Từ"
              aria-label="Lương sàn"
              value={minSalary}
              onChange={(e) => setMinSalary(e.target.value)}
            />
            <i>–</i>
            <input
              name="max"
              inputMode="decimal"
              placeholder="Đến"
              aria-label="Lương trần"
              value={maxSalary}
              onChange={(e) => setMaxSalary(e.target.value)}
            />
            <select name="currency" aria-label="Tiền tệ" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option value="VND">VND</option>
              <option value="USD">USD</option>
            </select>
            <em>{currency === 'USD' ? 'USD /' : 'triệu /'}</em>
            <select name="period" aria-label="Kỳ lương" value={period} onChange={(e) => setPeriod(e.target.value)}>
              {Object.entries(PERIOD_LABEL).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="pair">
          <label className="field">
            <span>Ngày đăng</span>
            <input name="posted" type="date" value={posted} onChange={(e) => setPosted(e.target.value)} />
          </label>
          <label className="field">
            <span>Hết hạn</span>
            <input name="expired" type="date" value={expired} onChange={(e) => setExpired(e.target.value)} />
          </label>
        </div>

        <p className="block-title">Nội dung</p>
        <ContentField label="Mô tả" name="description" value={description} onChange={setDescription} rows={16} />
        <ContentField label="Phúc lợi" name="benefits" value={benefits} onChange={setBenefits} rows={10} />

        <p className="block-title">Nguồn ghi nhận</p>
        {mappings.length ? (
          <ul className="mappings">
            {mappings.map((mapping, index) => (
              <li key={`${mapping.domain}-${index}`}>
                <div>
                  <SourceChips domains={[mapping.domain]} /> <span className="when">{stamp(mapping.crawledAt)}</span>
                </div>
                {mapping.jobUrl ? (
                  <a className="url" href={mapping.jobUrl} target="_blank" rel="noreferrer" title={mapping.jobUrl}>
                    {mapping.jobUrl.replace(/^https?:\/\//, '')}
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        ) : (
          <p className="fine">Chưa có nguồn ghi nhận.</p>
        )}
      </div>
      <div className="drawer-actions">
        <button className="btn ghost" type="button" onClick={onClose}>
          Hủy
        </button>
        <button className="btn" type="submit" disabled={busy}>
          {busy ? 'Đang lưu…' : 'Lưu'}
        </button>
      </div>
    </form>
  )
}
