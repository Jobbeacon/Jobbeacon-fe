import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import styles from './JobSearchBar.module.css'

type JobSearchBarProps = {
  keyword: string
  onSearch: (keyword: string) => void
}

export function JobSearchBar({ keyword, onSearch }: JobSearchBarProps) {
  const [keywordInput, setKeywordInput] = useState(keyword)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSearch(keywordInput.trim())
  }

  return (
    <form className={styles.searchBar} role="search" onSubmit={handleSubmit}>
      <label>
        <Search aria-hidden="true" />
        <input
          aria-label="Từ khóa"
          placeholder="Tên vị trí, công việc"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
        />
      </label>
      <button type="submit">Tìm việc</button>
    </form>
  )
}
