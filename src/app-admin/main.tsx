import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { AdminApp } from './AdminApp'
import { AdminProviders } from './providers/AdminProviders'
import '../shared/components/admin/theme-store'
import './styles/admin.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AdminProviders>
      <AdminApp />
    </AdminProviders>
  </StrictMode>,
)
