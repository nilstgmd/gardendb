<template>
  <div 
    class="modal" 
    role="dialog" 
    aria-modal="true"
    :aria-labelledby="modalTitleId"
    @click="handleBackdropClick"
    @keydown.esc="$emit('close')"
  >
    <div class="modal-content" @click.stop>
      <button 
        class="close" 
        @click="$emit('close')"
        aria-label="Close modal"
        type="button"
      >&times;</button>
      <h2 :id="modalTitleId">{{ plant ? 'Edit Plant' : 'Add New Plant' }}</h2>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="plant-name">Plant Name: <span class="required">*</span></label>
          <AutocompleteInput
            id="plant-name"
            v-model="formData.name"
            :suggestions="nameSuggestions"
            placeholder="e.g., My Tomato Plant"
            required
            @input="handleNameInput"
          />
        </div>
        
        <div class="form-group">
          <label for="plant-type">Plant Type: <span class="required">*</span></label>
          <AutocompleteInput
            id="plant-type"
            v-model="formData.type"
            :suggestions="typeSuggestions"
            placeholder="e.g., Tomato, Rose, Basil"
            required
            @input="handleTypeInput"
          />
        </div>
        
        <div class="form-group">
          <label for="plant-date">Date Planted: <span class="required">*</span></label>
          <input
            id="plant-date"
            v-model="formData.datePlanted"
            type="date"
            required
          >
        </div>
        
        <div class="form-group">
          <label for="plant-location">Location:</label>
          <input
            id="plant-location"
            v-model="formData.location"
            type="text"
            placeholder="e.g., Front yard, Kitchen window"
          >
        </div>
        
        <div class="form-group">
          <label for="plant-photo">Plant Photo:</label>
          <input
            id="plant-photo"
            ref="photoInput"
            type="file"
            accept="image/*"
            @change="handlePhotoChange"
          >
        </div>
        
        <div class="form-group">
          <label for="plant-notes">General Notes:</label>
          <textarea
            id="plant-notes"
            v-model="formData.notes"
            rows="3"
            placeholder="Any special notes about this plant..."
          ></textarea>
        </div>
        
        <div class="form-group">
          <label for="care-schedule">Care Schedule:</label>
          <select id="care-schedule" v-model="formData.careSchedule">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="biweekly">Bi-weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <button type="submit" class="btn btn-primary">
          {{ plant ? 'Update Plant' : 'Add Plant' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { usePlantsStore } from '../stores/plants'
import AutocompleteInput from './AutocompleteInput.vue'

const props = defineProps({
  plant: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close', 'save'])

const plantsStore = usePlantsStore()
const photoInput = ref(null)
const modalTitleId = `modal-title-${Date.now()}`

const formData = reactive({
  name: '',
  type: '',
  datePlanted: '',
  location: '',
  notes: '',
  careSchedule: 'weekly',
  photo: null
})

const nameQuery = ref('')
const typeQuery = ref('')

const nameSuggestions = computed(() => {
  return plantsStore.getPlantSuggestions(nameQuery.value)
})

const typeSuggestions = computed(() => {
  return plantsStore.getPlantSuggestions(typeQuery.value)
})

function handleNameInput(value) {
  nameQuery.value = value
  autoFillPlantType(value)
}

function handleTypeInput(value) {
  typeQuery.value = value
}

function autoFillPlantType(plantName) {
  if (formData.type) return // Don't override if already filled
  
  const typeMapping = {
    'tomato': 'Vegetable', 'pepper': 'Vegetable', 'lettuce': 'Vegetable',
    'basil': 'Herb', 'oregano': 'Herb', 'thyme': 'Herb', 'rosemary': 'Herb',
    'rose': 'Flower', 'sunflower': 'Flower', 'marigold': 'Flower',
    'pothos': 'Houseplant', 'snake plant': 'Houseplant', 'monstera': 'Houseplant',
    'aloe': 'Succulent', 'jade': 'Succulent', 'echeveria': 'Succulent'
  }
  
  const lowerName = plantName.toLowerCase()
  for (const [key, type] of Object.entries(typeMapping)) {
    if (lowerName.includes(key)) {
      formData.type = type
      break
    }
  }
}

function handlePhotoChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.photo = e.target.result
    }
    reader.readAsDataURL(file)
  }
}

function handleBackdropClick(event) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

async function handleSubmit() {
  const plantData = { ...formData }
  emit('save', plantData)
}

// Initialize form data when editing
onMounted(() => {
  if (props.plant) {
    Object.assign(formData, {
      name: props.plant.name,
      type: props.plant.type,
      datePlanted: props.plant.datePlanted,
      location: props.plant.location || '',
      notes: props.plant.notes || '',
      careSchedule: props.plant.careSchedule,
      photo: props.plant.photo
    })
  }
})
</script>