<template>
  <div v-if="visible" class="error-toast" :class="{ 'show': visible }">
    <div class="toast-content">
      <span class="toast-icon">{{ type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️' }}</span>
      <span class="toast-message">{{ message }}</span>
      <button class="toast-close" @click="close">&times;</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'info'].includes(value)
  },
  duration: {
    type: Number,
    default: 5000
  }
})

const emit = defineEmits(['close'])

const visible = ref(false)

function close() {
  visible.value = false
  emit('close')
}

onMounted(() => {
  visible.value = true
  if (props.duration > 0) {
    setTimeout(close, props.duration)
  }
})
</script>

<style scoped>
.error-toast {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 2000;
  max-width: 400px;
  opacity: 0;
  transform: translateX(100%);
  transition: all 0.3s ease;
}

.error-toast.show {
  opacity: 1;
  transform: translateX(0);
}

.toast-content {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(220, 53, 69, 0.2);
  border-left: 4px solid #dc3545;
  border-radius: 6px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 12px;
}

.toast-content[data-type="success"] {
  border-left-color: #28a745;
  border-color: rgba(40, 167, 69, 0.2);
}

.toast-content[data-type="info"] {
  border-left-color: #17a2b8;
  border-color: rgba(23, 162, 184, 0.2);
}

.toast-icon {
  font-size: 1.2rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  color: #2c3e35;
  font-weight: 400;
  line-height: 1.4;
}

.toast-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7c72;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.toast-close:hover {
  background: rgba(0, 0, 0, 0.1);
  color: #2c3e35;
}
</style> 