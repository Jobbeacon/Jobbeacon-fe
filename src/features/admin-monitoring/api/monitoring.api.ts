// URL Grafana để nhúng dashboard giám sát hệ thống; rỗng → báo chưa cấu hình.
export function getGrafanaUrl() {
  const runtime = (window as unknown as { __ENV__?: Record<string, string | undefined> }).__ENV__
  const raw = runtime?.VITE_GRAFANA_URL || (import.meta.env.VITE_GRAFANA_URL as string | undefined) || ''
  // env.js chưa render (còn "$VITE_...") coi như chưa cấu hình.
  return raw.startsWith('$') ? '' : raw.replace(/\/$/, '')
}

export type MonitoringDashboard = {
  title: string
  description: string
  path: string
}

// Dashboard đã provision sẵn trong Grafana (grafana/provisioning/dashboards). Thêm dòng mới ở đây khi có dashboard mới.
export const MONITORING_DASHBOARDS: MonitoringDashboard[] = [
  {
    title: 'Hệ thống',
    description: 'Trạng thái từng service, CPU/RAM/disk server, JVM heap theo dịch vụ.',
    path: '/d/system-overview/he-thong',
  },
  {
    title: 'Crawler',
    description: 'Trạng thái worker, hàng đợi, tốc độ thu thập tin và tỉ lệ lỗi.',
    path: '/d/crawler-overview/crawler',
  },
]
