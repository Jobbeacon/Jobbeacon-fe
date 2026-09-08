export type HomeJob = {
  id: number
  logo: string
  title: string
  company: string
  location: string
  salary: string
  skills: string[]
}

export type HomeCategory = {
  name: string
  count: number
  icon: 'monitor' | 'coins' | 'megaphone' | 'cart' | 'factory' | 'hardhat' | 'truck' | 'grid'
}
