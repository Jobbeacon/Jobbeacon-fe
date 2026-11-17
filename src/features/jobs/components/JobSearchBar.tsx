import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { CategoryPicker } from './CategoryPicker'
import { LocationPicker } from './LocationPicker'
import styles from './JobSearchBar.module.css'

type JobSearchBarProps = {
  keyword: string
  location: string
  categories: string[]
  onSearch: (keyword: string, location: string) => void
  onCategoriesChange: (categories: string[]) => void
}

export function JobSearchBar({ keyword, location, categories, onSearch, onCategoriesChange }: JobSearchBarProps) {
  const [keywordInput, setKeywordInput] = useState(keyword)
  const [locationInput, setLocationInput] = useState(location)
  const [seenKeyword, setSeenKeyword] = useState(keyword)
  const [seenLocation, setSeenLocation] = useState(location)
  if (keyword !== seenKeyword) {
    setSeenKeyword(keyword)
    setKeywordInput(keyword)
  }
  if (location !== seenLocation) {
    setSeenLocation(location)
    setLocationInput(location)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(keywordInput.trim(), locationInput.trim())
  }

  return (
    <form className={styles.searchBar} role="search" onSubmit={handleSubmit}>
      <CategoryPicker value={categories} onChange={onCategoriesChange} />
      <label>
        <Search aria-hidden="true" />
        <input
          aria-label="Từ khóa"
          placeholder="Vị trí, kỹ năng, công ty"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
        />
      </label>
      <LocationPicker
        value={locationInput}
        onChange={(nextLocation) => {
          setLocationInput(nextLocation)
          onSearch(keywordInput.trim(), nextLocation)
        }}
      />
      <button type="submit">Tìm việc</button>
    </form>
  )
}
