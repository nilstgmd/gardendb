<template>
  <div class="modal" @click="handleBackdropClick">
    <div class="modal-content modal-large" @click.stop>
      <span class="close" @click="$emit('close')">&times;</span>
      
      <h2>{{ plant.name }}</h2>
      
      <div class="plant-details">
        <div class="plant-details-left">
          <img 
            :src="imageUrl" 
            :alt="plant.name" 
            class="details-image"
            @error="handleImageError"
          >
          
          <div class="details-section">
            <h3>📋 Plant Information</h3>
            <p><strong>Type:</strong> {{ plant.type }}</p>
            <p><strong>Age:</strong> {{ age }}</p>
            <p><strong>Planted:</strong> {{ plantedDate }}</p>
            <p v-if="plant.location"><strong>Location:</strong> {{ plant.location }}</p>
            <p v-if="plant.notes"><strong>Notes:</strong> {{ plant.notes }}</p>
          </div>

          <div class="plant-actions">
            <button class="btn btn-secondary" @click="$emit('update-care', plant.id)">
              ✅ Mark as Cared For
            </button>
            <button class="btn btn-secondary" @click="$emit('edit', plant)">
              ✏️ Edit Plant
            </button>
            <button class="btn btn-danger" @click="$emit('delete', plant.id)">
              🗑️ Delete Plant
            </button>
          </div>
        </div>
        
        <div class="plant-details-right">
          <div class="details-section">
            <h3>🌿 Care Information</h3>
            <p><strong>Schedule:</strong> {{ plant.careSchedule }}</p>
            <p v-if="plant.lastCareDate">
              <strong>Last Care:</strong> {{ lastCareDate }}
            </p>
            
            <div :class="['next-care', { 'overdue': nextCare.isOverdue }]">
              <strong>Next Care:</strong> {{ nextCareText }}
            </div>
            
            <DetailedCareInstructions 
              :plant-name="plant.name"
              :plant-type="plant.type"
            />
          </div>

          <CareCalendar :plant="plant" />
          <PlantGrowthTimeline :plant="plant" />
          <WeatherIntegration />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlantsStore } from '../stores/plants.js'
import DetailedCareInstructions from './DetailedCareInstructions.vue'
import CareCalendar from './CareCalendar.vue'
import PlantGrowthTimeline from './PlantGrowthTimeline.vue'
import WeatherIntegration from './WeatherIntegration.vue'

const props = defineProps({
  plant: {
    type: Object,
    required: true
  }
})

defineEmits(['close', 'edit', 'delete', 'update-care'])

const plantsStore = usePlantsStore()
const imageUrl = ref('')

const age = computed(() => {
  return plantsStore.calculateAge(props.plant.datePlanted)
})

const plantedDate = computed(() => {
  return new Date(props.plant.datePlanted).toLocaleDateString()
})

const lastCareDate = computed(() => {
  return props.plant.lastCareDate 
    ? new Date(props.plant.lastCareDate).toLocaleDateString()
    : null
})

const nextCare = computed(() => {
  return plantsStore.getNextCareDate(props.plant)
})

const nextCareText = computed(() => {
  const care = nextCare.value
  if (typeof care === 'string') return care
  
  return care.isOverdue 
    ? `Overdue by ${Math.abs(care.daysUntil)} days`
    : `${care.date} (in ${care.daysUntil} days)`
})

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

function handleImageError(event) {
  event.target.src = 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'
}

onMounted(async () => {
  imageUrl.value = props.plant.photo || await plantsStore.getPlantImage(props.plant.type)
})
</script>