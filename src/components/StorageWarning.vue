<template>
  <div class="storage-warning" @click="$emit('close')">
    <strong>Storage Full</strong><br>
    Photos won't be saved due to browser storage limits. Plant data is still saved.
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped>
.storage-warning {
  position: fixed;
  top: 20px;
  right: 20px;
  background: rgba(255, 193, 7, 0.9);
  color: #856404;
  padding: 12px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  z-index: 10000;
  font-size: 14px;
  max-width: 300px;
  cursor: pointer;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>