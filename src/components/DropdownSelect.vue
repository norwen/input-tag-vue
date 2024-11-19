<script setup>
import { onClickOutside } from '@vueuse/core'
import { defineProps, defineEmits, ref, watch } from 'vue'

const props = defineProps({
  isOpen: { type: Boolean, default: false },
  options: { type: Array, required: true },
})

const emit = defineEmits(['update:isOpen', 'open', 'close', 'select'])

const dropdownOpen = ref(props.isOpen)
const dropdownRef = ref(null)

watch(
  () => props.isOpen,
  async (newValue) => {
    if (newValue !== dropdownOpen.value) {
      dropdownOpen.value = newValue
    }
  },
)

function selectOption(option) {
  emit('select', option)
  dropdownOpen.value = false
  emit('update:isOpen', false)
}

onClickOutside(dropdownRef, () => {
  if (dropdownOpen.value) {
    dropdownOpen.value = false
    emit('close')
    emit('update:isOpen', false)
  }
})
</script>

<template>
  <div ref="dropdownRef" class="dropdown">
    <div class="dropdown-control">
      <slot name="control"></slot>
    </div>
    <div v-if="dropdownOpen" class="dropdown-content">
      <ul>
        <li
          v-for="option in options"
          :key="option"
          tabindex="0"
          class="dropdown-item"
          @click="selectOption(option)"
        >
          {{ option }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.dropdown {
  position: relative;
  display: inline-block;
}

.dropdown-control {
  cursor: pointer;
}

.dropdown-content {
  position: absolute;
  min-width: 15rem;
  z-index: 1000;
  background: #ffffff;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px;
}

.dropdown-content ul {
  list-style: none;
  margin: 0;
  padding: 0;
}

.dropdown-content li {
  padding: 8px 12px;
  cursor: pointer;
}

.dropdown-content li:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dropdown-content li:focus {
  outline: none;
  background-color: rgba(0, 0, 0, 0.05);
}
</style>
