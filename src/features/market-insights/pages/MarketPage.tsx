import { X } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import { ErrorState } from '../../../shared/components/common/ErrorState'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { SalaryRangeChart } from '../components/SalaryRangeChart'
import { SkillBarChart } from '../components/SkillBarChart'
import { TrendChart } from '../components/TrendChart'
import { useMarketFilterOptions, useMarketOverview } from '../hooks/useMarketOverview'
import type { FilterOption, MarketGroup } from '../types/market.types'
import { formatCount, formatMillions, formatShare } from '../utils/market-format'
import styles from './MarketPage.module.css'

function nameOf(options: FilterOption[], id: string | null) {
  return id ? (options.find((option) => option.id === id)?.name ?? null) : null
}

export function MarketPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryId = searchParams.get('category')
  const provinceId = searchParams.get('province')
  const skillId = searchParams.get('skill')
  const skillName = searchParams.get('skill_name')

  const { categories, provinces } = useMarketFilterOptions()
  const { data, error, isInitialLoading, isRefreshing, retry } = useMarketOverview({ categoryId, provinceId, skillId })

  const updateFilters = (changes: Record<string, string | null>) => {
    const next = new URLSearchParams(searchParams)
    Object.entries(changes).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)))
    setSearchParams(next, { replace: true })
  }

  const toggle = (key: 'category' | 'province', group: MarketGroup) =>
    updateFilters({ [key]: searchParams.get(key) === group.id ? null : group.id })

  const toggleSkill = (skill: MarketGroup) =>
    skillId === skill.id
      ? updateFilters({ skill: null, skill_name: null })
      : updateFilters({ skill: skill.id, skill_name: skill.name })

  const categoryName = nameOf(categories, categoryId) ?? data?.byCategory.find((group) => group.id === categoryId)?.name
  const provinceName = nameOf(provinces, provinceId) ?? data?.byProvince.find((group) => group.id === provinceId)?.name
  const hasFilters = Boolean(categoryId || provinceId || skillId)

  const jobsLink = new URLSearchParams()
  if (categoryName) jobsLink.set('categories', categoryName)
  if (skillName) jobsLink.set('skills', skillName)
  if (provinceName) jobsLink.set('location', provinceName)

  const salaryShare = data && data.totalJobs > 0 ? data.jobsWithSalary / data.totalJobs : 0

  return (
    <main className={styles.page}>
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link to="/">Trang chủ</Link> / <span>Thị trường việc làm</span>
        </nav>
        <h1>Thị trường việc làm</h1>
        <p>Mức lương, kỹ năng được tuyển và số tin mới, tính từ các tin tuyển dụng JobBeacon đã thu thập.</p>
      </section>

      <section className={styles.section}>
        <div className={styles.filters} role="group" aria-label="Bộ lọc thống kê">
          <label className={styles.filter}>
            <span>Ngành nghề</span>
            <select value={categoryId ?? ''} onChange={(event) => updateFilters({ category: event.target.value || null })}>
              <option value="">Tất cả ngành</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className={styles.filter}>
            <span>Tỉnh/thành</span>
            <select value={provinceId ?? ''} onChange={(event) => updateFilters({ province: event.target.value || null })}>
              <option value="">Toàn quốc</option>
              {provinces.map((province) => (
                <option key={province.id} value={province.id}>
                  {province.name}
                </option>
              ))}
            </select>
          </label>

          {skillId && (
            <button
              type="button"
              className={styles.chip}
              onClick={() => updateFilters({ skill: null, skill_name: null })}
              aria-label={`Bỏ lọc kỹ năng ${skillName ?? ''}`}
            >
              Kỹ năng: {skillName ?? 'đã chọn'} <X aria-hidden="true" />
            </button>
          )}

          {hasFilters && (
            <button
              type="button"
              className={styles.clear}
              onClick={() => updateFilters({ category: null, province: null, skill: null, skill_name: null })}
            >
              Xóa bộ lọc
            </button>
          )}

          <Link className={styles.jobsLink} to={`/jobs${jobsLink.size > 0 ? `?${jobsLink}` : ''}`}>
            Xem việc làm phù hợp
          </Link>
        </div>

        {isInitialLoading && <LoadingState label="Đang tính số liệu thị trường..." />}
        {error && !data && <ErrorState message={error} onRetry={retry} />}

        {data && (
          <div className={`${styles.content} ${isRefreshing ? styles.refreshing : ''}`} aria-busy={isRefreshing}>
            {error && <p className={styles.inlineError}>{error}</p>}

            <div className={styles.figures}>
              <div className={styles.heroFigure}>
                <span className={styles.figureLabel}>Lương trung vị</span>
                <strong>{formatMillions(data.salary.median)}</strong>
                <span className={styles.figureNote}>
                  {data.salary.median !== null
                    ? `50% tin ở mức ${formatMillions(data.salary.p25)} – ${formatMillions(data.salary.p75)} / tháng`
                    : `Cần ít nhất ${data.minSalarySample} tin có lương để tính`}
                </span>
              </div>
              <div className={styles.tile}>
                <span className={styles.figureLabel}>Tin tuyển dụng</span>
                <strong>{formatCount(data.totalJobs)}</strong>
              </div>
              <div className={styles.tile}>
                <span className={styles.figureLabel}>Tin có ghi lương</span>
                <strong>{formatCount(data.jobsWithSalary)}</strong>
                <span className={styles.figureNote}>{formatShare(salaryShare)} số tin</span>
              </div>
            </div>

            <div className={styles.grid}>
              <SkillBarChart
                skills={data.topSkills}
                minSample={data.minSalarySample}
                selectedId={skillId}
                onSelect={toggleSkill}
              />
              <SalaryRangeChart
                title="Lương theo ngành nghề"
                groups={data.byCategory}
                minSample={data.minSalarySample}
                onSelect={(group) => toggle('category', group)}
                selectedId={categoryId}
              />
              <SalaryRangeChart
                title="Lương theo tỉnh/thành"
                subtitle="10 tỉnh/thành có nhiều tin nhất. Bấm một tỉnh để lọc."
                groups={data.byProvince}
                minSample={data.minSalarySample}
                onSelect={(group) => toggle('province', group)}
                selectedId={provinceId}
              />
              <SalaryRangeChart
                title="Lương theo kinh nghiệm"
                subtitle="Theo số năm kinh nghiệm tin tuyển dụng yêu cầu."
                groups={data.byExperience}
                minSample={data.minSalarySample}
              />
            </div>

            <TrendChart points={data.postingTrend} />

            <p className={styles.method}>
              Cách tính: lương quy về VND/tháng, lấy giữa khoảng lương của mỗi tin; lương USD đổi theo tỷ giá{' '}
              {data.usdVndRate.toLocaleString('vi-VN')} đ; bỏ các mức dưới 2 triệu hoặc trên 300 triệu/tháng. Nhóm có
              dưới {data.minSalarySample} tin ghi lương không hiện số liệu lương. Chỉ khoảng {formatShare(salaryShare)} tin
              có ghi lương, nên số liệu nghiêng về những nơi công khai lương.
            </p>
          </div>
        )}
      </section>
    </main>
  )
}
