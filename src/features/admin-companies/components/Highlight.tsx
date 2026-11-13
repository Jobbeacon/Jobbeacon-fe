import { foldText } from '../../../shared/utils/admin-format'

// Tô đậm đoạn khớp từ khóa (so khớp không dấu).
export function Highlight({ text, query }: { text: string; query: string }) {
  const term = query.trim()
  const at = term ? foldText(text).indexOf(foldText(term)) : -1
  if (at < 0) {
    return <>{text}</>
  }
  return (
    <>
      {text.slice(0, at)}
      <mark>{text.slice(at, at + term.length)}</mark>
      {text.slice(at + term.length)}
    </>
  )
}
