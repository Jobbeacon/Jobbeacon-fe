import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import styles from './CompanySearchBar.module.css'

type CompanySearchBarProps = {
  keyword: string
  onSearch: (keyword: string) => void
}

export function CompanySearchBar({ keyword, onSearch }: CompanySearchBarProps) {
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
          aria-label="Tên công ty"
          placeholder="Tên công ty"
          value={keywordInput}
          onChange={(event) => setKeywordInput(event.target.value)}
        />
      </label>
      <button type="submit">Tìm công ty</button>
    </form>
  )
}
