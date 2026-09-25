import DOMPurify from 'dompurify'

// Link trong HTML crawl về luôn mở tab mới và không cho trang đích truy cập window.opener.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A' && node.hasAttribute('href')) {
    node.setAttribute('target', '_blank')
    node.setAttribute('rel', 'noopener noreferrer nofollow')
  }
})

// HTML mô tả job lấy từ trang tuyển dụng bên ngoài: chỉ giữ thẻ định dạng, bỏ script/style/iframe/form.
export function sanitizeHtml(html: string) {
  return DOMPurify.sanitize(html, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ['style', 'form', 'input', 'button', 'textarea', 'select'],
    FORBID_ATTR: ['style', 'class', 'id'],
  })
}
