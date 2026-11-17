import { createServiceClient } from './service-client'

// Jobbeacon-be: job, công ty, địa điểm, category, skill, hồ sơ ứng viên/CV, job đã lưu, chat.
// Context path /jobbeacon-be (server.servlet.context-path), API dưới /api/v1.
export const backendService = createServiceClient('/jobbeacon-be/api/v1')
