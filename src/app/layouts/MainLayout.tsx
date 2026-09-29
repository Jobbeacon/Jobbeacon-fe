import { Outlet } from 'react-router-dom'
import Header from '../../shared/components/navigation/header/Header'
import HomeFooter from '../../features/home/components/HomeFooter'
import { ScrollToTop } from '../router/ScrollToTop'

export function MainLayout() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      <HomeFooter />
    </>
  )
}
