import { Outlet } from 'react-router-dom'
import Header from '../../shared/components/navigation/header/Header'
import HomeFooter from '../../features/home/components/HomeFooter'

export function MainLayout() {
  return (
    <>
      <Header />
      <Outlet />
      <HomeFooter />
    </>
  )
}
