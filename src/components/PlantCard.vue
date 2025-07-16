<template>
  <div 
    :class="['gallery-card', { 
      'selected': selected, 
      'bulk-mode': bulkMode,
      [`health-${plant.healthStatus || 'healthy'}`]: true
    }]" 
    @click="handleClick"
  >
    <!-- Selection checkbox for bulk mode -->
    <div v-if="bulkMode" class="selection-checkbox" @click.stop="$emit('toggle-select')">
      <input type="checkbox" :checked="selected" readonly>
    </div>
    
    <!-- Status badges -->
    <div class="status-badges">
      <div v-if="needsAttention" class="attention-badge">⚠️ Needs Care</div>
      <div :class="['health-badge', `health-${plant.healthStatus || 'healthy'}`]">
        {{ getHealthIcon(plant.healthStatus || 'healthy') }} {{ getHealthLabel(plant.healthStatus || 'healthy') }}
      </div>
    </div>
    
    <img 
      :src="imageUrl" 
      :alt="plant.name" 
      class="gallery-image"
      @error="handleImageError"
    >
    
    <div class="gallery-info">
      <div class="gallery-name">{{ plant.name }}</div>
      <div class="gallery-type">{{ plant.type }}</div>
      <div class="gallery-age">{{ age }}</div>
      
      <!-- Quick stats -->
      <div class="quick-stats">
        <span class="stat-item" :title="nextCareText">
          🗓️ {{ getShortCareText() }}
        </span>
        <span v-if="plant.growthMilestones?.length" class="stat-item" :title="'Growth milestones'">
          📈 {{ plant.growthMilestones.length }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlantsStore } from '../stores/plants'

const props = defineProps({
  plant: {
    type: Object,
    required: true
  },
  bulkMode: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click', 'toggle-select'])

const plantsStore = usePlantsStore()
const imageUrl = ref('')

const needsAttention = computed(() => {
  return plantsStore.needsAttention(props.plant)
})

const age = computed(() => {
  return plantsStore.calculateAge(props.plant.datePlanted)
})

const nextCareText = computed(() => {
  const nextCare = plantsStore.getNextCareDate(props.plant)
  if (typeof nextCare === 'string') return nextCare
  
  return nextCare.isOverdue 
    ? `Overdue by ${Math.abs(nextCare.daysUntil)} days`
    : `${nextCare.date} (in ${nextCare.daysUntil} days)`
})

function handleClick() {
  emit('click')
}

function handleImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'
}

function getHealthIcon(status) {
  const icons = {
    'healthy': '💚',
    'needs-attention': '💛',
    'sick': '❤️'
  }
  return icons[status] || '💚'
}

function getHealthLabel(status) {
  const labels = {
    'healthy': 'Healthy',
    'needs-attention': 'Needs Attention',
    'sick': 'Sick'
  }
  return labels[status] || 'Healthy'
}

function getShortCareText() {
  const nextCare = plantsStore.getNextCareDate(props.plant)
  if (typeof nextCare === 'string') return 'Care needed'
  
  if (nextCare.isOverdue) return 'Overdue'
  if (nextCare.daysUntil === 0) return 'Today'
  if (nextCare.daysUntil === 1) return 'Tomorrow'
  return `${nextCare.daysUntil}d`
}

onMounted(async () => {
  imageUrl.value = props.plant.photo || await plantsStore.getPlantImage(props.plant.type)
})
</script>