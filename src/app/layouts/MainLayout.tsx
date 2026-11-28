import { Outlet } from 'react-router-dom'
import Header from '../../shared/components/navigation/header/Header'
import HomeFooter from '../../features/home/components/HomeFooter'
import { NotificationBell } from '../../features/notifications/components/NotificationBell'
import { ScrollToTop } from '../router/ScrollToTop'

type MainLayoutProps = {
  showFooter?: boolean
}

export function MainLayout({ showFooter = true }: MainLayoutProps) {
  return (
    <>
      <ScrollToTop />
      <Header authenticatedActions={<NotificationBell />} />
      <Outlet />
      {showFooter && <HomeFooter />}
    </>
  )
}
