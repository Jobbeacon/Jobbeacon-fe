import { getApp, getApps, initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import type { Auth } from 'firebase/auth'
import { getFirebaseConfig } from './env'

let authInstance: Auth | undefined

export function getFirebaseAuth() {
  if (authInstance) {
    return authInstance
  }

  const app = getApps().length > 0 ? getApp() : initializeApp(getFirebaseConfig())
  authInstance = getAuth(app)
  authInstance.useDeviceLanguage()

  return authInstance
}
