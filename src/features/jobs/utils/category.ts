import type { JobCategory } from '../types/job.types'

export function getCategoryPaths(categories: JobCategory[]): JobCategory[][] {
  return categories.flatMap((category) =>
    category.children.length === 0
      ? [[category]]
      : getCategoryPaths(category.children).map((path) => [category, ...path]),
  )
}