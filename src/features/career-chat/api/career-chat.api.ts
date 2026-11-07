import {
  ApiError,
  apiClient,
  authorizedFetch,
  createApiErrorFromResponse,
} from '../../../shared/api/api-client'
import type { ApiResponse } from '../../../shared/types/api.types'
import type { AgentReply, AgentToolCall, AgentToolCallEvent } from '../types/career-chat.types'
import { readSseEvents } from './sse'

const CHAT_ENDPOINT = '/api/v1/chat'
const CHAT_STREAM_ENDPOINT = '/api/v1/chat/stream'
const STREAM_INTERRUPTED_ERROR = 'Kết nối bị gián đoạn. Vui lòng thử lại.'
const STREAM_FALLBACK_ERROR = 'Hệ thống đang gặp sự cố, vui lòng thử lại sau.'

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

type StreamToolCallDto = {
  name?: string
  args?: Record<string, unknown> | null
}

type StreamDeltaDto = {
  text?: string
}

type StreamDoneDto = {
  tool_calls?: { name: string; success: boolean }[] | null
}

type StreamErrorDto = {
  message?: string
}

type StreamAgentMessageOptions = {
  signal?: AbortSignal
  onToolCall?: (toolCall: AgentToolCallEvent) => void
  onDelta?: (text: string) => void
}

function parseEventData<T>(data: string): T {
  try {
    return JSON.parse(data) as T
  } catch {
    throw new ApiError('Phản hồi từ máy chủ không hợp lệ.', 200)
  }
}

function createAbortError() {
  return new DOMException('Đã huỷ yêu cầu.', 'AbortError')
}

// Gửi tin nhắn qua SSE: nhận tool_call / delta dần dần, kết thúc bằng done hoặc error.
// Bị huỷ qua signal thì ném DOMException 'AbortError'.
export async function streamAgentMessage(
  message: string,
  { signal, onToolCall, onDelta }: StreamAgentMessageOptions = {},
): Promise<{ toolCalls: AgentToolCall[] }> {
  let response: Response
  try {
    response = await authorizedFetch(CHAT_STREAM_ENDPOINT, {
      method: 'POST',
      body: { message },
      headers: { Accept: 'text/event-stream' },
      signal,
    })
  } catch (error) {
    if (signal?.aborted) throw createAbortError()
    if (error instanceof ApiError) throw error
    throw new ApiError(STREAM_INTERRUPTED_ERROR, 0)
  }

  if (!response.ok) {
    throw await createApiErrorFromResponse(response)
  }
  if (!response.body) {
    throw new ApiError(STREAM_INTERRUPTED_ERROR, response.status)
  }

  try {
    for await (const { event, data } of readSseEvents(response.body, signal)) {
      switch (event) {
        case 'tool_call': {
          const toolCall = parseEventData<StreamToolCallDto>(data)
          onToolCall?.({ name: toolCall.name ?? '', args: toolCall.args ?? {} })
          break
        }
        case 'delta': {
          const { text } = parseEventData<StreamDeltaDto>(data)
          if (text) onDelta?.(text)
          break
        }
        case 'done': {
          const { tool_calls } = parseEventData<StreamDoneDto>(data)
          return {
            toolCalls: (tool_calls ?? []).map(({ name, success }) => ({ name, success, args: {} })),
          }
        }
        case 'error': {
          const { message: errorMessage } = parseEventData<StreamErrorDto>(data)
          throw new ApiError(errorMessage || STREAM_FALLBACK_ERROR, 200)
        }
      }
    }
  } catch (error) {
    if (signal?.aborted) throw createAbortError()
    if (error instanceof ApiError) throw error
    throw new ApiError(STREAM_INTERRUPTED_ERROR, 0)
  }

  // Stream đóng mà không có done/error: coi là lỗi mạng.
  if (signal?.aborted) throw createAbortError()
  throw new ApiError(STREAM_INTERRUPTED_ERROR, 0)
}

export async function clearAgentSession(): Promise<void> {
  await apiClient.delete<ApiResponse<void>>(CHAT_ENDPOINT)
}
