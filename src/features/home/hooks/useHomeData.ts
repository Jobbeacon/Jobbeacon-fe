import type { HomeCategory } from '../types/home.types'

const categories: HomeCategory[] = [
  { name: 'Công nghệ', count: 2430, icon: 'monitor' },
  { name: 'Tài chính', count: 1250, icon: 'coins' },
  { name: 'Marketing', count: 840, icon: 'megaphone' },
  { name: 'Bán hàng', count: 1320, icon: 'cart' },
  { name: 'Sản xuất', count: 680, icon: 'factory' },
  { name: 'Xây dựng', count: 480, icon: 'hardhat' },
  { name: 'Logistics', count: 410, icon: 'truck' },
  { name: 'Khác', count: 2100, icon: 'grid' },
]

export function useHomeData() {
  return { categories }
}
