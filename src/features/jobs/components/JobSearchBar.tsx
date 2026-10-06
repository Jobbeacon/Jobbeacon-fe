import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { LocationPicker } from './LocationPicker'
import styles from './JobSearchBar.module.css'

type JobSearchBarProps = {
  keyword: string
  location: string
  onSearch: (keyword: string, location: string) => void
}

export function JobSearchBar({ keyword, location, onSearch }: JobSearchBarProps) {
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
