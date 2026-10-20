import { useCallback, useEffect, useState } from 'react'
import { ApiError } from '../../../shared/api/api-client'
import { clearAgentSession, sendAgentMessage } from '../api/career-chat.api'
import type { ChatMessage } from '../types/career-chat.types'

const FALLBACK_ERROR = 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.'

function createMessage(role: ChatMessage['role'], content: string, isError = false): ChatMessage {
  return { role, content, isError }
}

function toErrorMessage(error: unknown) {
  return error instanceof ApiError && error.message ? error.message : FALLBACK_ERROR
}

export function useCareerChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isSending, setIsSending] = useState(false)

  useEffect(() => {
    clearAgentSession().catch(() => undefined)
  }, [])

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim()
      if (!text || isSending) return

      setMessages((current) => [...current, createMessage('user', text)])
      setIsSending(true)
      try {
        const { reply } = await sendAgentMessage(text)
        setMessages((current) => [...current, createMessage('assistant', reply)])
      } catch (error) {
        setMessages((current) => [...current, createMessage('assistant', toErrorMessage(error), true)])
      } finally {
        setIsSending(false)
      }
    },
    [isSending],
  )

  const resetConversation = useCallback(async () => {
    if (isSending) return
    setMessages([])
    await clearAgentSession().catch(() => undefined)
  }, [isSending])

  // Gọi khi người dùng xác nhận rời trang: xóa session trên server, lỗi cũng không chặn việc rời đi.
  const leaveConversation = useCallback(() => clearAgentSession().catch(() => undefined), [])

  return { messages, isSending, sendMessage, resetConversation, leaveConversation }
}
