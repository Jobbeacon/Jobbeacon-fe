import { useCallback } from 'react'
import { Dialog } from '../../../shared/components/admin'
import { getJob } from '../api/admin-jobs.api'
import { useLoad } from '../hooks/useLoad'
import { JobForm } from './JobForm'

type JobEditorProps = {
  jobId: string | null
  onClose: () => void
  onChanged: () => void
}

// Drawer sửa tin: tải chi tiết rồi mới dựng form (state form khởi tạo từ chi tiết).
export function JobEditor({ jobId, onClose, onChanged }: JobEditorProps) {
  return (
    <Dialog open={Boolean(jobId)} onClose={onClose} className="drawer wide" labelledBy="job-heading" resizeKey="job">
      {jobId ? <JobEditorBody key={jobId} jobId={jobId} onClose={onClose} onChanged={onChanged} /> : null}
    </Dialog>
  )
}

function JobEditorBody({ jobId, onClose, onChanged }: { jobId: string } & Omit<JobEditorProps, 'jobId'>) {
  const load = useCallback((signal: AbortSignal) => getJob(jobId, signal), [jobId])
  const { data, error, loading } = useLoad(load)

  if (data && !loading) {
    return <JobForm job={data} onClose={onClose} onChanged={onChanged} />
  }
  return (
    <form onSubmit={(event) => event.preventDefault()}>
      <div className="drawer-bar">
        <div>
          <h2 id="job-heading">Sửa tin</h2>
        </div>
      </div>
      <div className="drawer-body">
        <p className="fine">{error ?? 'Đang tải tin…'}</p>
      </div>
      <div className="drawer-actions">
        <button className="btn ghost" type="button" onClick={onClose}>
          Đóng
        </button>
      </div>
    </form>
  )
}
