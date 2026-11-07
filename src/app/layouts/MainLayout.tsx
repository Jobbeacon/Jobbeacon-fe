import { Outlet } from 'react-router-dom'
import Header from '../../shared/components/navigation/header/Header'
import HomeFooter from '../../features/home/components/HomeFooter'
import { ScrollToTop } from '../router/ScrollToTop'

type MainLayoutProps = {
  showFooter?: boolean
}

export function MainLayout({ showFooter = true }: MainLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <Header />
      <Outlet />
      {showFooter && <HomeFooter />}
    </>
  )
}
