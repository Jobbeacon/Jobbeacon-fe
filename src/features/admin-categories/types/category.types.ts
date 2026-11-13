// Node cây danh mục ngành (GET /api/v1/admin/categories), đã đổi sang camelCase.
export type CategoryNode = {
  id: string
  name: string
  level: number
  // Tổng số tin (distinct) gán vào chính node và mọi node con.
  jobCount: number
  children: CategoryNode[]
}

// Thông tin tra cứu nhanh của một node trong cây đã làm phẳng.
export type CategoryEntry = {
  node: CategoryNode
  parentId: string
  // Đường dẫn từ gốc tới chính node (gồm node).
  path: CategoryNode[]
}

export type CategoryIndex = {
  roots: CategoryNode[]
  byId: Map<string, CategoryEntry>
  // Số mục theo cấp: [cấp 1, cấp 2, cấp 3].
  levelCounts: [number, number, number]
}

export type CategoryInput = {
  name: string
  parentId: string | null
}

// Nhãn theo cấp (0-based).
export const LEVEL_LABEL = ['Nhóm ngành', 'Ngành', 'Vị trí'] as const

export const MAX_LEVEL = 3
