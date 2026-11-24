import { useState } from 'react'
import { ExternalLink } from 'lucide-react'
import { getGrafanaUrl, MONITORING_DASHBOARDS } from '../api/monitoring.api'
import { useTheme } from '../../../shared/components/admin'

// Nhúng dashboard Grafana đã provision sẵn (xem grafana/provisioning/dashboards). Yêu cầu Grafana bật
// GF_SECURITY_ALLOW_EMBEDDING=true và GF_AUTH_ANONYMOUS_ENABLED=true (xem jobbeacon-deployment/docker-compose.yml).
export function MonitoringPage() {
  const grafanaUrl = getGrafanaUrl()
  const [activeIndex, setActiveIndex] = useState(0)
  const active = MONITORING_DASHBOARDS[activeIndex]
  const { theme } = useTheme()

  return (
    <main className="stage">
      <header className="stage-head">
        <div>
          <h1>Giám sát hệ thống</h1>
          <p className="lead">Số liệu vận hành lấy trực tiếp từ Grafana. Mở toàn màn hình để xem chi tiết hoặc chỉnh khoảng thời gian.</p>
        </div>
      </header>

      {!grafanaUrl ? (
        <p className="notice">
          Chưa cấu hình Grafana. Đặt <code>VITE_GRAFANA_URL</code> trỏ tới địa chỉ Grafana (ví dụ http://localhost:3001).
        </p>
      ) : (
        <div className="stack">
          <section className="sheet">
            <div className="toolbar">
              {MONITORING_DASHBOARDS.length > 1 && (
                <div className="switch" role="tablist">
                  {MONITORING_DASHBOARDS.map((dashboard, index) => (
                    <button
                      key={dashboard.path}
                      type="button"
                      role="tab"
                      aria-selected={index === activeIndex}
                      onClick={() => setActiveIndex(index)}
                    >
                      {dashboard.title}
                    </button>
                  ))}
                </div>
              )}
              <p className="count">{active.description}</p>
              <a
                className="btn ghost"
                href={`${grafanaUrl}${active.path}?orgId=1&theme=${theme}`}
                target="_blank"
                rel="noreferrer"
              >
                <ExternalLink aria-hidden="true" strokeWidth={1.8} />
                Mở toàn màn hình
              </a>
            </div>
            <iframe
              key={`${active.path}-${theme}`}
              className="monitor-frame"
              src={`${grafanaUrl}${active.path}?orgId=1&kiosk&theme=${theme}`}
              title={active.title}
              loading="lazy"
            />
          </section>
        </div>
      )}
    </main>
  )
}
