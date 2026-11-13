import { useEffect } from 'react'
import type { ReactNode } from 'react'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import { CategoriesPage } from '../features/admin-categories/pages/CategoriesPage'
import { CompaniesPage } from '../features/admin-companies/pages/CompaniesPage'
import { JobsPage } from '../features/admin-jobs/pages/JobsPage'
import { OverviewPage } from '../features/admin-overview/pages/OverviewPage'
import { SkillsPage } from '../features/admin-skills/pages/SkillsPage'
import { UsersPage } from '../features/admin-users/pages/UsersPage'
import { AdminGuard } from './guards/AdminGuard'
import { AdminLayout } from './layouts/AdminLayout'
import { AdminLoginPage } from './pages/AdminLoginPage'

const SITE_NAME = 'JobBeacon Admin'

// Đặt document.title theo trang: "Việc làm · JobBeacon Admin".
function Titled({ title, children }: { title?: string; children: ReactNode }) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : SITE_NAME
  }, [title])
  return children
}

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Titled title="Đăng nhập">
        <AdminLoginPage />
      </Titled>
    ),
  },
  {
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      { index: true, element: <Titled title="Tổng quan"><OverviewPage /></Titled> },
      { path: 'jobs', element: <Titled title="Việc làm"><JobsPage /></Titled> },
      { path: 'companies', element: <Titled title="Công ty"><CompaniesPage /></Titled> },
      { path: 'users', element: <Titled title="Người dùng"><UsersPage /></Titled> },
      { path: 'categories', element: <Titled title="Danh mục ngành"><CategoriesPage /></Titled> },
      { path: 'skills', element: <Titled title="Kỹ năng"><SkillsPage /></Titled> },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])

export function AdminApp() {
  return <RouterProvider router={router} />
}
