<template>
  <div class="input-container">
    <DropdownSelect :is-open="isDropdownOpen" :options="dropdownTags" @select="insertTag">
      <template #control>
        <div
          ref="editableElement"
          class="input-area"
          contenteditable="true"
          @input="handleInput"
        ></div>
      </template>

      <template #option="{ option }">
        <div class="dropdown-item">
          {{ option }}
        </div>
      </template>
    </DropdownSelect>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import TextEditor from '@/utils/TextEditor.js'
import { debounce } from '@/utils/debounce.js'

const editableElement = ref(null)
const editor = ref(new TextEditor())
const dropdownTags = ref([])
const activeTag = ref(editor.value.activeTag)
const isDropdownOpen = computed(() => dropdownTags.value.length > 0 && !!activeTag.value)

onMounted(() => {
  editor.value.attachToElement(editableElement.value)
})

onBeforeUnmount(() => {
  editor.value.detachElement()
})

const fetchTags = (tag) => {
  const tagNormalised = tag.toLowerCase()

  return new Promise((resolve) => {
    setTimeout(() => {
      const allTags = [
        'abdomen',
        'abdominal',
        'bone',
        'brain',
        'cancer',
        'contrast',
        'cuff',
        'CT',
        'detached',
        'dilatation',
        'female',
        'fragment',
        'head',
        'hip',
        'injury',
        'kidney',
        'knee',
        'left',
        'liver',
        'male',
        'MRI',
        'pain',
        'pancreas',
        'right',
        'rotator',
        'severe_pain',
        'shoulder',
        'spine',
        'torn',
        'tumour',
        'XRAY',
      ]
      const filteredTags = allTags.filter((t) => {
        return t.toLowerCase().startsWith(tagNormalised)
      })

      resolve(filteredTags)
    }, 500)
  })
}

watch(activeTag, async (newValue, prevValue) => {
  if (newValue === prevValue) return
  if (!newValue) {
    dropdownTags.value = []
    return
  }

  const tags = await fetchTags(newValue)
  dropdownTags.value = tags
})

const handleInput = debounce((e) => {
  editor.value.handleInput()
  activeTag.value = editor.value.activeTag
}, 200)

const insertTag = (tag) => {
  editor.value.replaceWord(tag)
}
</script>

<style scoped>
.input-area {
  border: 1px solid #ccc;
  padding: 10px;
  font-size: 16px;
  line-height: 1.5;
  min-height: 10rem;
  min-width: 24rem;
  outline: none;
  white-space: pre-wrap;
}

.dropdown-item {
  background: blue;
}
</style>
