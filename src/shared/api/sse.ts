export type SseEvent = {
  event: string
  data: string
}

function createAbortError() {
  return new DOMException('Đã huỷ yêu cầu.', 'AbortError')
}

// Tách một khối (các dòng giữa hai dòng trống) thành event; bỏ qua khối chỉ có comment.
function parseBlock(block: string): SseEvent | null {
  let event = 'message'
  const dataLines: string[] = []

  for (const line of block.split('\n')) {
    if (!line || line.startsWith(':')) continue

    const colonIndex = line.indexOf(':')
    const field = colonIndex === -1 ? line : line.slice(0, colonIndex)
    let value = colonIndex === -1 ? '' : line.slice(colonIndex + 1)
    if (value.startsWith(' ')) value = value.slice(1)

    if (field === 'event') event = value
    else if (field === 'data') dataLines.push(value)
  }

  return dataLines.length > 0 ? { event, data: dataLines.join('\n') } : null
}

// Đọc stream text/event-stream (fetch + ReadableStream, không dùng EventSource vì cần header Authorization).
export async function* readSseEvents(
  body: ReadableStream<Uint8Array>,
  signal?: AbortSignal,
): AsyncGenerator<SseEvent> {
  const reader = body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''
  let isFinished = false

  const cancel = () => {
    reader.cancel().catch(() => undefined)
  }
  signal?.addEventListener('abort', cancel)

  try {
    while (true) {
      if (signal?.aborted) throw createAbortError()

      const { value, done } = await reader.read()
      if (signal?.aborted) throw createAbortError()

      // Chuẩn hoá \r\n và \r về \n; giữ lại \r cuối buffer vì \n có thể nằm ở chunk sau.
      buffer += done ? decoder.decode() : decoder.decode(value, { stream: true })
      buffer = buffer.replace(/\r\n?/g, (match, offset: number, whole: string) =>
        match === '\r' && offset === whole.length - 1 && !done ? match : '\n',
      )

      let separatorIndex = buffer.indexOf('\n\n')
      while (separatorIndex !== -1) {
        const sseEvent = parseBlock(buffer.slice(0, separatorIndex))
        buffer = buffer.slice(separatorIndex + 2)
        if (sseEvent) yield sseEvent
        separatorIndex = buffer.indexOf('\n\n')
      }

      if (done) {
        isFinished = true
        // Khối cuối không có dòng trống kết thúc: theo chuẩn SSE thì bỏ đi.
        return
      }
    }
  } finally {
    signal?.removeEventListener('abort', cancel)
    // Consumer thoát sớm (done, error, JSON hỏng) hoặc abort: huỷ stream để đóng kết nối.
    if (!isFinished) cancel()
    reader.releaseLock()
  }
}
