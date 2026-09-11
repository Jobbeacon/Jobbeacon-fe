type RuntimeEnvironment = {
  VITE_API_BASE_URL?: string
  VITE_FIREBASE_API_KEY?: string
  VITE_FIREBASE_AUTH_DOMAIN?: string
  VITE_FIREBASE_PROJECT_ID?: string
  VITE_FIREBASE_STORAGE_BUCKET?: string
  VITE_FIREBASE_MESSAGING_SENDER_ID?: string
  VITE_FIREBASE_APP_ID?: string
}

declare global {
  interface Window {
    __ENV__?: RuntimeEnvironment
  }
}

const runtimeEnv = window.__ENV__ ?? {}

const readFirebaseEnv = (name: string, value: string | undefined) => {
  if (!value) {
    throw new Error(`Thiếu cấu hình Firebase: ${name}`)
  }

  return value
}

export function getApiBaseUrl() {
  return (runtimeEnv.VITE_API_BASE_URL ?? import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '')
}

export function getFirebaseConfig() {
  return {
    apiKey: readFirebaseEnv(
      'VITE_FIREBASE_API_KEY',
      runtimeEnv.VITE_FIREBASE_API_KEY ?? import.meta.env.VITE_FIREBASE_API_KEY,
    ),
    authDomain: readFirebaseEnv(
      'VITE_FIREBASE_AUTH_DOMAIN',
      runtimeEnv.VITE_FIREBASE_AUTH_DOMAIN ?? import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    ),
    projectId: readFirebaseEnv(
      'VITE_FIREBASE_PROJECT_ID',
      runtimeEnv.VITE_FIREBASE_PROJECT_ID ?? import.meta.env.VITE_FIREBASE_PROJECT_ID,
    ),
    storageBucket: readFirebaseEnv(
      'VITE_FIREBASE_STORAGE_BUCKET',
      runtimeEnv.VITE_FIREBASE_STORAGE_BUCKET ?? import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    ),
    messagingSenderId: readFirebaseEnv(
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      runtimeEnv.VITE_FIREBASE_MESSAGING_SENDER_ID ??
        import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    ),
    appId: readFirebaseEnv(
      'VITE_FIREBASE_APP_ID',
      runtimeEnv.VITE_FIREBASE_APP_ID ?? import.meta.env.VITE_FIREBASE_APP_ID,
    ),
  }
}
