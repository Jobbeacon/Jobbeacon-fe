import { useEffect, useId, useRef, useState } from 'react'
import { ChevronRight, MapPin, Search, X } from 'lucide-react'
import { getProvinces, getWards } from '../api/jobs.api'
import type { LocationItem } from '../types/job.types'
import styles from './LocationPicker.module.css'

type LocationPickerProps = {
  value: string
  onChange: (location: string) => void
}

function fold(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/gi, 'd')
    .toLowerCase()
}

function readPlaces(value: string) {
  return value.split('|').map((item) => item.trim()).filter(Boolean)
}

function wardLabel(wardName: string, provinceName: string) {
  return `${wardName}, ${provinceName}`
}

export function LocationPicker({ value, onChange }: LocationPickerProps) {
  const panelId = useId()
  const rootRef = useRef<HTMLDivElement>(null)
  const provincesRef = useRef<LocationItem[] | null>(null)
  const wardsRef = useRef<Record<string, LocationItem[]>>({})
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState<string[]>([])
  const [provinces, setProvinces] = useState<LocationItem[]>([])
  const [activeProvince, setActiveProvince] = useState<LocationItem | null>(null)
  const [wards, setWards] = useState<LocationItem[]>([])
  const [loadingProvinces, setLoadingProvinces] = useState(false)
  const [loadingWards, setLoadingWards] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!open) return

    const close = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  const loadProvinces = async () => {
    if (provincesRef.current) {
      setProvinces(provincesRef.current)
      return
    }
    setLoadingProvinces(true)
    setError(null)
    try {
      const items = await getProvinces()
      provincesRef.current = items
      setProvinces(items)
    } catch {
      setError('Không tải được danh sách tỉnh/thành phố.')
    } finally {
      setLoadingProvinces(false)
    }
  }

  const showWards = async (province: LocationItem) => {
    setActiveProvince(province)
    const cached = wardsRef.current[province.id]
    if (cached) {
      setWards(cached)
      setLoadingWards(false)
      return
    }
    setWards([])
    setLoadingWards(true)
    setError(null)
    try {
      const items = await getWards(province.id)
      wardsRef.current[province.id] = items
      setWards(items)
    } catch {
      setError('Không tải được danh sách phường/xã.')
    } finally {
      setLoadingWards(false)
    }
  }

  const openPanel = () => {
    setDraft(readPlaces(value))
    setQuery('')
    setOpen(true)
    void loadProvinces()
  }

  const needle = fold(query.trim())
  const visibleProvinces = needle
    ? provinces.filter((province) => fold(province.name).includes(needle))
    : provinces
  const visibleWards =
    activeProvince && needle ? wards.filter((ward) => fold(ward.name).includes(needle)) : wards

  const provinceSelected = (province: LocationItem) => draft.includes(province.name)
  const wardSelected = (ward: LocationItem, province: LocationItem) =>
    draft.includes(wardLabel(ward.name, province.name))

  const toggleProvince = (province: LocationItem) => {
    setDraft((current) => {
      if (current.includes(province.name)) {
        return current.filter((item) => item !== province.name)
      }
      return [
        ...current.filter((item) => !item.endsWith(`, ${province.name}`)),
        province.name,
      ]
    })
    void showWards(province)
  }

  const toggleWard = (ward: LocationItem, province: LocationItem) => {
    const label = wardLabel(ward.name, province.name)
    setDraft((current) => {
      const withoutProvince = current.filter((item) => item !== province.name)
      if (withoutProvince.includes(label)) {
        return withoutProvince.filter((item) => item !== label)
      }
      return [...withoutProvince, label]
    })
  }

  const apply = () => {
    onChange(draft.join('|'))
    setOpen(false)
  }

  const selectedLabel = readPlaces(value).join(', ')

  return (
    <div className={styles.picker} ref={rootRef}>
      <MapPin aria-hidden="true" />
      <button
        className={styles.trigger}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => (open ? setOpen(false) : openPanel())}
      >
        {selectedLabel || <span className={styles.placeholder}>Địa điểm</span>}
      </button>
      {value ? (
        <button className={styles.clear} type="button" aria-label="Xóa địa điểm" onClick={() => onChange('')}>
          <X aria-hidden="true" />
        </button>
      ) : null}

      {open ? (
        <div className={styles.panel} id={panelId} role="dialog" aria-label="Địa điểm">
          <div className={styles.panelHead}>
            <div className={styles.titleRow}>
              <strong>Địa điểm</strong>
              <span>Tìm theo tỉnh, phường/xã</span>
            </div>
            <label className={styles.find}>
              <Search aria-hidden="true" />
              <input
                value={query}
                placeholder="Tìm tỉnh thành, phường xã"
                aria-label="Tìm tỉnh thành, phường xã"
                onChange={(event) => setQuery(event.target.value)}
              />
            </label>
          </div>

          {error ? <p className={styles.status}>{error}</p> : null}

          <div className={styles.columns}>
            <ul className={styles.column} aria-label="Tỉnh/thành phố">
              {loadingProvinces ? <li className={styles.status}>Đang tải...</li> : null}
              {visibleProvinces.map((province) => (
                <li key={province.id} className={activeProvince?.id === province.id ? styles.active : undefined}>
                  <label className={styles.check}>
                    <input
                      type="checkbox"
                      checked={provinceSelected(province)}
                      aria-label={province.name}
                      onChange={() => toggleProvince(province)}
                    />
                  </label>
                  <button type="button" onClick={() => void showWards(province)}>
                    {province.name}
                    <ChevronRight aria-hidden="true" />
                  </button>
                </li>
              ))}
              {!loadingProvinces && visibleProvinces.length === 0 ? (
                <li className={styles.status}>Không có kết quả</li>
              ) : null}
            </ul>

            <ul className={styles.column} aria-label="Phường/xã">
              {!activeProvince ? <li className={styles.hint}>Vui lòng chọn Tỉnh/Thành phố</li> : null}
              {activeProvince && loadingWards ? <li className={styles.status}>Đang tải...</li> : null}
              {activeProvince && !loadingWards && !needle ? (
                <li>
                  <label className={styles.option}>
                    <input
                      type="checkbox"
                      checked={provinceSelected(activeProvince)}
                      onChange={() => toggleProvince(activeProvince)}
                    />
                    Tất cả
                  </label>
                </li>
              ) : null}
              {activeProvince && !loadingWards
                ? visibleWards.map((ward) => (
                    <li key={ward.id}>
                      <label className={styles.option}>
                        <input
                          type="checkbox"
                          checked={wardSelected(ward, activeProvince)}
                          onChange={() => toggleWard(ward, activeProvince)}
                        />
                        {ward.name}
                      </label>
                    </li>
                  ))
                : null}
              {activeProvince && !loadingWards && visibleWards.length === 0 ? (
                <li className={styles.status}>Không có kết quả</li>
              ) : null}
            </ul>
          </div>

          <div className={styles.footer}>
            <button type="button" className={styles.reset} onClick={() => setDraft([])}>
              Bỏ chọn tất cả
            </button>
            <button type="button" className={styles.apply} onClick={apply}>
              Áp dụng
            </button>
          </div>
        </div>
      ) : null}
    </div>
  )
}
