import { useState } from 'react'
import { useSkillSearch } from '../hooks/useSkillSearch'
import type { SkillSearchItem } from '../types/candidate-profile.types'
import { Combobox } from './Combobox'

type SkillSearchProps = {
  existingSkillIds: Set<string>
  onSelect: (skill: SkillSearchItem) => void
  disabled?: boolean
}

export function SkillSearch({ existingSkillIds, onSelect, disabled = false }: SkillSearchProps) {
  const [input, setInput] = useState('')
  const { results, error, isLoading } = useSkillSearch(input)

  const options = isLoading || error ? [] : results.filter((skill) => !existingSkillIds.has(skill.id))

  let status: string | null = null
  if (isLoading) status = 'Đang tìm...'
  else if (error) status = error
  else if (results.length === 0) status = 'Không tìm thấy kỹ năng phù hợp. Chỉ chọn được kỹ năng có sẵn trong hệ thống.'
  else if (options.length === 0) status = 'Các kỹ năng phù hợp đã có trong hồ sơ.'

  return (
    <Combobox
      value={input}
      onValueChange={setInput}
      options={options}
      status={status}
      isError={Boolean(error)}
      placeholder="Tìm và thêm kỹ năng, vd. React"
      ariaLabel="Tìm kỹ năng để thêm"
      disabled={disabled}
      onSelect={(skill) => {
        setInput('')
        onSelect(skill)
      }}
    />
  )
}
