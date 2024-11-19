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
    {{ activeTag }}
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, computed } from 'vue'
import DropdownSelect from '@/components/DropdownSelect.vue'
import TextEditor from '@/utils/TextEditor.js'

const availableTags = ['#liver', '#heart', '#lung', '#spleen', '#stomach']
const dropdownTags = ref([...availableTags])

const editableElement = ref(null)
const editor = ref(new TextEditor())
const activeTag = ref(editor.value.activeTag)
const isDropdownOpen = computed(() => dropdownTags.value.length > 0 && !!activeTag.value)

onMounted(() => {
  console.log(editableElement)
  editor.value.attachToElement(editableElement.value)
})

onBeforeUnmount(() => {
  editor.value.detachElement()
})

watch(activeTag, (newValue, prevValue) => {
  if (newValue === prevValue) return
  if (!newValue) dropdownTags.value = []

  dropdownTags.value = availableTags.filter((tag) => tag.includes(newValue))
})

const handleInput = () => {
  editor.value.handleInput()
  activeTag.value = editor.value.activeTag
}

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
