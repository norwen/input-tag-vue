<template>
  <div class="input-container" style="position: relative">
    <div ref="inputRef" contenteditable="true" @input="handleInput" class="input-area"></div>

    <ul v-if="dropdownTags.length > 0" class="dropdown" style="">
      <li
        v-for="(tag, index) in dropdownTags"
        :key="index"
        @click="insertTag(tag)"
        style="cursor: pointer; padding: 5px; background: #eee"
      >
        {{ tag }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'HashtagInput',
  setup() {
    const availableTags = ['#liver', '#heart', '#lung', '#spleen', '#stomach']
    const inputRef = ref(null)
    const dropdownTags = ref([])
    const activeTag = ref('')

    const saveCursorPosition = () => {
      const selection = window.getSelection()
      if (!selection.rangeCount) return null

      const range = selection.getRangeAt(0)
      const preCursorRange = range.cloneRange()
      preCursorRange.selectNodeContents(inputRef.value)
      preCursorRange.setEnd(range.startContainer, range.startOffset)

      return preCursorRange.toString().length
    }

    const restoreCursorPosition = (offset) => {
      if (offset === null || inputRef.value === null) return

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

      traverseNodes(inputRef.value)
      selection.removeAllRanges()
      selection.addRange(range)
    }

    // Подсветка хештегов
    const highlightHashtags = () => {
      const text = inputRef.value.innerText
      const highlightedText = text.replace(/#(\w+)/g, `<span style="color:blue;">#$1</span>`)

      const cursorPosition = saveCursorPosition()
      inputRef.value.innerHTML = highlightedText
      restoreCursorPosition(cursorPosition)
    }

    const handleInput = () => {
      const content = inputRef.value.innerText

      const match = content.match(/#(\w*)$/)
      if (match) {
        const tag = match[1]
        activeTag.value = tag
        dropdownTags.value = availableTags.filter((t) =>
          t.toLowerCase().includes(`${tag.toLowerCase()}`),
        )
      } else {
        activeTag.value = ''
        dropdownTags.value = []
      }

      highlightHashtags()
    }

    const insertTag = (tag) => {
      const content = inputRef.value.innerText
      const updatedContent = content.replace(/#(\w*)$/, tag + ' ')
      inputRef.value.innerText = updatedContent
      highlightHashtags()
      dropdownTags.value = [] // close dropdown
      activeTag.value = ''

      const cursorOffset = updatedContent.length
      restoreCursorPosition(cursorOffset)
    }

    return {
      inputRef,
      dropdownTags,
      handleInput,
      insertTag,
    }
  },
}
</script>

<style scoped>
.input-area {
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 16px;
  line-height: 1.5;
  min-height: 100px;
  outline: none;
  white-space: pre-wrap;
}
</style>
