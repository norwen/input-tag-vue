export default class TextEditor {
  constructor(initialText = '') {
    this.element = null
    this.activeTag = ''
  }

  attachToElement(element) {
    this.element = element
  }

  detachElement() {
    this.element = null
  }

  saveCursorPosition() {
    const selection = window.getSelection()
    if (!selection.rangeCount) return null

    const range = selection.getRangeAt(0)
    const preCursorRange = range.cloneRange()
    preCursorRange.selectNodeContents(this.element)
    preCursorRange.setEnd(range.startContainer, range.startOffset)

    return preCursorRange.toString().length
  }

  restoreCursorPosition(offset) {
    if (offset === null || this.element === null) return

    const selection = window.getSelection()
    const range = document.createRange()
    let charCount = 0

    const traverseNodes = (node) => {
      if (node.nodeType === 3) {
        const nextCharCount = charCount + node.textContent.length
        if (offset <= nextCharCount) {
          range.setStart(node, offset - charCount)
          range.collapse(true)
          return true // Курсор установлен
        }
        charCount = nextCharCount
      } else {
        for (let i = 0; i < node.childNodes.length; i++) {
          if (traverseNodes(node.childNodes[i])) return true
        }
      }
      return false
    }

    traverseNodes(this.element)
    selection.removeAllRanges()
    selection.addRange(range)
  }

  highlightHashtags() {
    const text = this.element.innerText
    const highlightedText = text.replace(/#(\w+)/g, `<span style="color:blue;">#$1</span>`)

    const cursorPosition = this.saveCursorPosition()
    this.element.innerHTML = highlightedText
    this.restoreCursorPosition(cursorPosition)
  }

  handleInput() {
    const selection = window.getSelection()
    const range = selection.getRangeAt(0)
    const container = range.startContainer
    const text = container.textContent || ''
    const offset = range.startOffset

    const wordAtCursor = this.findWordAtCursor(text, offset)

    if (wordAtCursor.startsWith('#')) {
      this.activeTag = wordAtCursor.slice(1) // Remove # symbol
    } else {
      this.activeTag = ''
    }

    this.highlightHashtags()
  }

  findWordAtCursor(text, cursorPosition) {
    // Find the word boundaries around the cursor
    const beforeCursor = text?.slice(0, cursorPosition).match(/[#\w]*$/)?.[0] || ''
    const afterCursor = text?.slice(cursorPosition).match(/^[#\w]*/)?.[0] || ''

    return beforeCursor + afterCursor
  }
  replaceWord(tag) {
    const content = this.element.innerText
    const updatedContent = content.replace(/#(\w*)$/, `#${tag}`)
    this.element.innerText = updatedContent
    this.activeTag = ''

    const cursorOffset = updatedContent.length
    this.restoreCursorPosition(cursorOffset)

    this.highlightHashtags()
  }
}
