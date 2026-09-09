import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { App } from './app/App'
import { AppProviders } from './app/providers/AppProviders'
import './app/styles/theme.css'
import './app/styles/globals.css'
import './app/styles/user-layout.css'
import './features/auth/auth.css'
import './features/candidate-profile/candidate-profile.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
)
