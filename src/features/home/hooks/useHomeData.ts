import type { HomeCategory, HomeJob } from '../types/home.types'

const jobs: HomeJob[] = [
  { id: 1, logo: 'FPT', title: 'Java Developer', company: 'FPT Software', location: 'Hà Nội', salary: '25 - 35 triệu', skills: ['Java', 'Spring', 'SQL'] },
  { id: 2, logo: 'ABC', title: 'Backend Engineer', company: 'ABC Technology', location: 'Hồ Chí Minh', salary: '30 - 45 triệu', skills: ['Java', 'Kafka', 'Redis'] },
  { id: 3, logo: 'T', title: 'Frontend Developer', company: 'TechViet', location: 'Hà Nội', salary: '20 - 35 triệu', skills: ['ReactJS', 'TypeScript', 'CSS'] },
  { id: 4, logo: 'V', title: 'Data Analyst', company: 'Viettel Digital', location: 'Hồ Chí Minh', salary: '20 - 30 triệu', skills: ['SQL', 'Python', 'Data Visualization'] },
]

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
  return { jobs, categories }
}
