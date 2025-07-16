<template>
  <div class="autocomplete-container">
    <input
      :id="id"
      :value="modelValue"
      :placeholder="placeholder"
      :required="required"
      type="text"
      @input="handleInput"
      @blur="handleBlur"
      @focus="showSuggestions = true"
    >
    
    <div 
      v-if="showSuggestions && filteredSuggestions.length > 0" 
      class="autocomplete-suggestions"
    >
      <div
        v-for="suggestion in filteredSuggestions"
        :key="suggestion"
        class="autocomplete-item"
        @mousedown="selectSuggestion(suggestion)"
      >
        {{ suggestion }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  id: String,
  modelValue: String,
  suggestions: {
    type: Array,
    default: () => []
  },
  placeholder: String,
  required: Boolean
})

const emit = defineEmits(['update:modelValue', 'input'])

const showSuggestions = ref(false)

const filteredSuggestions = computed(() => {
  if (!props.modelValue || props.modelValue.length < 2) return []
  return props.suggestions.filter(suggestion =>
    suggestion.toLowerCase().includes(props.modelValue.toLowerCase())
  )
})

function handleInput(event) {
  const value = event.target.value
  emit('update:modelValue', value)
  emit('input', value)
  showSuggestions.value = true
}

function handleBlur() {
  // Delay hiding suggestions to allow click events
  setTimeout(() => {
    showSuggestions.value = false
  }, 150)
}

function selectSuggestion(suggestion) {
  emit('update:modelValue', suggestion)
  emit('input', suggestion)
  showSuggestions.value = false
}
</script>