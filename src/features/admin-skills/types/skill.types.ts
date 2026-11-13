export type SkillSort = 'jobs' | 'recent' | 'name'
export type SkillFilter = '' | 'recent' | 'noalias' | 'unused'

export const SKILL_SORTS: SkillSort[] = ['jobs', 'recent', 'name']
export const SKILL_FILTERS: SkillFilter[] = ['', 'recent', 'noalias', 'unused']

export type SkillStats = {
  total: number
  recent: number
  withoutAlias: number
  unused: number
}

export type Skill = {
  id: string
  name: string
  aliases: string[]
  jobCount: number
  cvCount: number
  createdAt: string | null
}

export type SkillQuery = {
  q?: string
  filter?: SkillFilter
  sort?: SkillSort
  page?: number
  size?: number
}

export type SkillInput = {
  name: string
  aliases: string[]
}
