import { useContext } from 'react'
import { NotificationsContext } from '../store/notifications.store'

export function useNotificationsContext() {
  const context = useContext(NotificationsContext)
  if (!context) {
    throw new Error('useNotificationsContext phải dùng bên trong NotificationsProvider')
  }
  return context
}
