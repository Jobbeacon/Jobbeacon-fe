export type NotificationType = 'JOB_MATCH_DIGEST' | 'WELCOME'

export type NotificationJobItem = {
  jobId: string
  title: string
  company: string
  url?: string
}

export type JobMatchDigestPayload = {
  digestKey: string
  jobs: NotificationJobItem[]
}

export type AppNotification = {
  id: string
  type: NotificationType
  title: string
  body: string
  // Payload thô (đã giữ nguyên key); với JOB_MATCH_DIGEST dùng `digest`.
  payload: Record<string, unknown>
  digest: JobMatchDigestPayload | null
  read: boolean
  readAt: string | null
  createdAt: string
}

export type NotificationPage = {
  items: AppNotification[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export type NotificationPreference = {
  jobMatchEnabled: boolean
}
