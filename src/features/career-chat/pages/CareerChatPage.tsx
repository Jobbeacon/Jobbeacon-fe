import { useCallback, useState } from 'react'
import { Bot, BriefcaseBusiness, FileText, LogIn, MapPin, SquarePen, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../auth/hooks/useAuth'
import { LoadingState } from '../../../shared/components/common/LoadingState'
import { ChatComposer } from '../components/ChatComposer'
import { ChatThread } from '../components/ChatThread'
import { LeaveChatDialog } from '../components/LeaveChatDialog'
import { useCareerChat } from '../hooks/useCareerChat'
import { useLeaveChatGuard } from '../hooks/useLeaveChatGuard'
import styles from '../components/CareerChat.module.css'

const suggestions = [
  { Icon: BriefcaseBusiness, text: 'Tìm việc Java Backend ở Hà Nội' },
  { Icon: Wallet, text: 'Việc làm Frontend React lương trên 20 triệu' },
  { Icon: MapPin, text: 'Tuyển Data Analyst tại Hồ Chí Minh' },
  { Icon: FileText, text: 'Việc làm kế toán không yêu cầu kinh nghiệm' },
]

function AgentChat() {
  const { messages, isSending, sendMessage, resetConversation, leaveConversation } = useCareerChat()
  const { isConfirmOpen, isLeaving, confirmLeave, cancelLeave } = useLeaveChatGuard({
    enabled: messages.length > 0,
    onConfirmLeave: leaveConversation,
  })
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const closeResetConfirm = useCallback(() => setIsResetConfirmOpen(false), [])

  const confirmReset = async () => {
    setIsResetting(true)
    try {
      await resetConversation()
    } finally {
      setIsResetting(false)
      setIsResetConfirmOpen(false)
    }
  }

  return (
    <main className={styles.page}>
      <LeaveChatDialog open={isConfirmOpen} isLeaving={isLeaving} onConfirm={confirmLeave} onCancel={cancelLeave} />
      <LeaveChatDialog
        open={isResetConfirmOpen}
        isLeaving={isResetting}
        title="Bắt đầu cuộc trò chuyện mới?"
        description="Cuộc trò chuyện hiện tại sẽ bị xóa và không thể khôi phục. Bạn có chắc muốn tiếp tục?"
        confirmLabel="Trò chuyện mới"
        onConfirm={confirmReset}
        onCancel={closeResetConfirm}
      />
      {messages.length > 0 && (
        <button
          className={styles.newChatButton}
          type="button"
          disabled={isSending}
          onClick={() => setIsResetConfirmOpen(true)}
        >
          <SquarePen aria-hidden="true" />
          <span>Cuộc trò chuyện mới</span>
        </button>
      )}

      {messages.length > 0 ? (
        <ChatThread messages={messages} isPending={isSending} />
      ) : (
        <div className={styles.welcome}>
          <span className={styles.welcomeIcon} aria-hidden="true"><Bot /></span>
          <h1>Hôm nay mình có thể giúp gì cho bạn?</h1>
          <p>Hỏi JobBeacon Agent để tìm việc theo kỹ năng, địa điểm và mức lương mong muốn.</p>
          <div className={styles.suggestions}>
            {suggestions.map(({ Icon, text }) => (
              <button
                key={text}
                className={styles.suggestion}
                type="button"
                disabled={isSending}
                onClick={() => sendMessage(text)}
              >
                <Icon aria-hidden="true" />
                <span>{text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <ChatComposer disabled={isSending} onSend={sendMessage} />
    </main>
  )
}

export function CareerChatPage() {
  const { user, isInitializing } = useAuth()

  if (isInitializing) {
    return (
      <main className={styles.page}>
        <div className={styles.welcome}>
          <LoadingState label="Đang kiểm tra phiên đăng nhập..." />
        </div>
      </main>
    )
  }

  if (!user) {
    return (
      <main className={styles.page}>
        <div className={styles.welcome}>
          <span className={styles.welcomeIcon} aria-hidden="true"><Bot /></span>
          <h1>JobBeacon Agent</h1>
          <p>Đăng nhập để trò chuyện với trợ lý AI và tìm việc phù hợp với bạn.</p>
          <Link className={styles.loginButton} to="/login">
            <LogIn aria-hidden="true" />
            <span>Đăng nhập</span>
          </Link>
        </div>
      </main>
    )
  }

  return <AgentChat key={user.uid} />
}

export default CareerChatPage
