<template>
  <div v-if="visible" class="loading-spinner" :class="{ 'overlay': overlay }">
    <div class="spinner">
      <div class="spinner-circle"></div>
    </div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup>
defineProps({
  visible: {
    type: Boolean,
    default: true
  },
  message: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.loading-spinner {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.loading-spinner.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(44, 62, 53, 0.4);
  backdrop-filter: blur(8px);
  z-index: 1500;
}

.spinner {
  width: 40px;
  height: 40px;
  position: relative;
}

.spinner-circle {
  width: 100%;
  height: 100%;
  border: 3px solid rgba(52, 73, 58, 0.2);
  border-top: 3px solid #52735a;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-message {
  color: #52735a;
  font-size: 0.9rem;
  font-weight: 400;
  margin: 0;
  text-align: center;
}

.overlay .loading-message {
  color: white;
}
</style> 