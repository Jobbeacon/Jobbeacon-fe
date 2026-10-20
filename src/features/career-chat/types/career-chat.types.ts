export type ChatRole = 'user' | 'assistant'

export type ChatMessage = {
  role: ChatRole
  content: string
  isError?: boolean
}

export type AgentToolCall = {
  name: string
  args: Record<string, unknown>
  success: boolean
}

export type AgentReply = {
  reply: string
  toolCalls: AgentToolCall[]
}
