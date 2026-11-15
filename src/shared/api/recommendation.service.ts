import { createServiceClient } from './service-client'

// Jobbeacon-recommendation: ghi tương tác của user với job và trả gợi ý việc làm.
// Context path /jobbeacon-recommendation (server.servlet.context-path), API dưới /api/v1.
export const recommendationService = createServiceClient('/jobbeacon-recommendation/api/v1')
