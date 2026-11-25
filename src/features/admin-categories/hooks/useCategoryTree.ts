import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { getCategoryTree } from '../api/categories.api'
import type { CategoryEntry, CategoryIndex, CategoryNode } from '../types/category.types'

// Làm phẳng cây để tra cứu theo id, kèm path và số mục từng cấp.
export function indexCategories(roots: CategoryNode[]): CategoryIndex {
  const byId = new Map<string, CategoryEntry>()
  const levelCounts: [number, number, number] = [0, 0, 0]
  const visit = (node: CategoryNode, parentId: string, parentPath: CategoryNode[]) => {
    const path = [...parentPath, node]
    byId.set(node.id, { node, parentId, path })
    const depth = Math.min(path.length, 3) - 1
    levelCounts[depth] += 1
    for (const child of node.children ?? []) {
      visit(child, node.id, path)
    }
  }
  for (const root of roots) {
    visit(root, '', [])
  }
  return { roots, byId, levelCounts }
}

// Tải cây danh mục; reload() trả về index mới (để reveal mục vừa lưu).
export function useCategoryTree() {
  const [tree, setTree] = useState<CategoryNode[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const requestRef = useRef(0)
  const abortRef = useRef<AbortController | null>(null)

  const reload = useCallback(async (): Promise<CategoryIndex | null> => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    const requestId = ++requestRef.current
    try {
      const data = await getCategoryTree(controller.signal)
      // Bỏ kết quả của request cũ.
      if (requestId !== requestRef.current) {
        return null
      }
      setTree(data)
      setError(null)
      return indexCategories(data)
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestRef.current) {
        return null
      }
      setError(err instanceof Error ? err.message : 'Không tải được danh mục.')
      return null
    }
  }, [])

  // Lần tải đầu: setState nằm trong callback của promise.
  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    const requestId = ++requestRef.current
    getCategoryTree(controller.signal).then(
      (data) => {
        if (requestId === requestRef.current) {
          setTree(data)
          setError(null)
        }
      },
      (err: unknown) => {
        if (!controller.signal.aborted && requestId === requestRef.current) {
          setError(err instanceof Error ? err.message : 'Không tải được danh mục.')
        }
      },
    )
    // Hủy request đang chạy (kể cả reload) khi rời trang.
    return () => abortRef.current?.abort()
  }, [])

  const index = useMemo(() => (tree ? indexCategories(tree) : null), [tree])

  return { index, error, reload }
}
