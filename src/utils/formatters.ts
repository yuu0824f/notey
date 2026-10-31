export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp

  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (seconds < 60) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`

  const date = new Date(timestamp)
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
  })
}

export function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp)
  return date.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Extracts plain text snippet from HTML string for note preview and search
 */
export function extractPlainText(html: string): string {
  if (!html) return ''
  // Create a temporary element to safely extract text content
  const temp = document.createElement('div')
  temp.innerHTML = html
  return temp.textContent || temp.innerText || ''
}

/**
 * Calculates word and character count
 */
export function getStats(html: string): { words: number; characters: number; readingTime: number } {
  const text = extractPlainText(html).trim()
  const characters = text.length
  const words = text ? text.split(/\s+/).filter(Boolean).length : 0
  const readingTime = Math.max(1, Math.ceil(words / 200)) // ~200 wpm
  return { words, characters, readingTime }
}

/**
 * Triggers a file download in the browser
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

/**
 * Simple HTML to Markdown converter
 */
export function htmlToMarkdown(html: string, title?: string): string {
  const temp = document.createElement('div')
  temp.innerHTML = html

  let md = title ? `# ${title}\n\n` : ''

  function traverse(node: Node): string {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || ''
    }

    if (node.nodeType !== Node.ELEMENT_NODE) return ''

    const el = node as HTMLElement
    const tag = el.tagName.toLowerCase()
    const children = Array.from(el.childNodes).map(traverse).join('')

    switch (tag) {
      case 'h1':
        return `\n\n# ${children}\n\n`
      case 'h2':
        return `\n\n## ${children}\n\n`
      case 'h3':
        return `\n\n### ${children}\n\n`
      case 'p':
        return `\n\n${children}\n\n`
      case 'strong':
      case 'b':
        return `**${children}**`
      case 'em':
      case 'i':
        return `*${children}*`
      case 's':
      case 'strike':
      case 'del':
        return `~~${children}~~`
      case 'u':
        return `<u>${children}</u>`
      case 'code':
        return el.parentElement?.tagName.toLowerCase() === 'pre'
          ? children
          : `\`${children}\``
      case 'pre':
        return `\n\n\`\`\`\n${children}\n\`\`\`\n\n`
      case 'blockquote':
        return `\n\n> ${children.trim().replace(/\n/g, '\n> ')}\n\n`
      case 'ul':
        return `\n\n${children}\n\n`
      case 'ol':
        return `\n\n${children}\n\n`
      case 'li': {
        const isTask = el.getAttribute('data-type') === 'taskItem'
        const isChecked = el.getAttribute('data-checked') === 'true'
        if (isTask) {
          return `- [${isChecked ? 'x' : ' '}] ${children}\n`
        }
        return `- ${children}\n`
      }
      case 'hr':
        return `\n\n---\n\n`
      case 'a': {
        const href = el.getAttribute('href') || ''
        return `[${children}](${href})`
      }
      case 'img': {
        const src = el.getAttribute('src') || ''
        const alt = el.getAttribute('alt') || 'Image'
        return `![${alt}](${src})`
      }
      case 'br':
        return '\n'
      default:
        return children
    }
  }

  md += traverse(temp)
  // Clean up repeated newlines
  return md.replace(/\n{3,}/g, '\n\n').trim()
}
