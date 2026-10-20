import { apiClient } from '../../../shared/api/api-client'
import type { ApiResponse } from '../../../shared/types/api.types'
import type { AgentReply, AgentToolCall } from '../types/career-chat.types'

const CHAT_ENDPOINT = '/api/v1/chat'

type AgentToolCallApiDto = {
  name: string
  args: Record<string, unknown> | null
  success: boolean
}

type ChatResponseApiDto = {
  reply: string
  tool_calls: AgentToolCallApiDto[] | null
}

function toToolCall(toolCall: AgentToolCallApiDto): AgentToolCall {
  return {
    name: toolCall.name,
    args: toolCall.args ?? {},
    success: toolCall.success,
  }
}

function toAgentReply(response: ChatResponseApiDto): AgentReply {
  return {
    reply: response.reply,
    toolCalls: (response.tool_calls ?? []).map(toToolCall),
  }
}

// Lịch sử hội thoại được backend lưu theo user (Redis), nên chỉ cần gửi tin nhắn mới nhất.
export async function sendAgentMessage(message: string): Promise<AgentReply> {
  const response = await apiClient.post<ApiResponse<ChatResponseApiDto>>(CHAT_ENDPOINT, { message })
  return toAgentReply(response.data)
}

export async function clearAgentSession(): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(CHAT_ENDPOINT)
}
