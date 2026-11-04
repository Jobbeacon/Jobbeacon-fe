export type ChatRole = 'user' | 'assistant'

export type ChatMessageStatus = 'streaming' | 'done' | 'error' | 'stopped'

export type ChatMessage = {
  id: string
  role: ChatRole
  content: string
  isError?: boolean
  // Chỉ dùng cho tin assistant
  status?: ChatMessageStatus
  // Mô tả tool đang chạy, vd. "Đang tìm việc: Java · Hồ Chí Minh"
  activity?: string
  toolCalls?: AgentToolCall[]
  // Nội dung tin user để gửi lại khi lỗi
  retryOf?: string
  // Thông báo lỗi, tách khỏi phần text đã nhận được trước khi lỗi
  errorMessage?: string
}

export type AgentToolCall = {
  name: string
  args: Record<string, unknown>
  success: boolean
}

export type AgentToolCallEvent = {
  name: string
  args: Record<string, unknown>
}

export type AgentReply = {
  reply: string
  toolCalls: AgentToolCall[]
}
