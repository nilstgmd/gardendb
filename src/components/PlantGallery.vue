<template>
  <div v-if="plants.length === 0" class="empty-state">
    <h3>🌱 No plants yet!</h3>
    <p>Add your first plant to start tracking your garden.</p>
  </div>
  
  <div v-else>
    <!-- Gallery header with pagination info -->
    <div class="gallery-header">
      <div class="gallery-info">
        <span class="total-plants">{{ plants.length }} plants total</span>
        <span class="page-info">
          Showing {{ (currentPage - 1) * plantsPerPage + 1 }}-{{ Math.min(currentPage * plantsPerPage, plants.length) }} of {{ plants.length }}
        </span>
      </div>
      
      <div class="plants-per-page">
        <label>Plants per page:</label>
        <select v-model="plantsPerPage" @change="currentPage = 1">
          <option :value="6">6</option>
          <option :value="12">12</option>
          <option :value="24">24</option>
          <option :value="48">48</option>
        </select>
      </div>
    </div>

    <!-- Bulk selection controls -->
    <div class="gallery-controls" v-if="plantsStore.selectedPlants.size > 0 || showBulkMode">
      <div class="bulk-actions">
        <button 
          class="btn btn-secondary btn-sm" 
          @click="selectAllCurrentPage()"
        >
          Select Page ({{ paginatedPlants.length }})
        </button>
        <button 
          class="btn btn-secondary btn-sm" 
          @click="plantsStore.selectAllPlants()"
        >
          Select All ({{ plants.length }})
        </button>
        <button 
          class="btn btn-secondary btn-sm" 
          @click="plantsStore.clearSelection()"
        >
          Clear Selection
        </button>
        <span class="selection-count">{{ plantsStore.selectedPlants.size }} selected</span>
      </div>
      <button 
        class="btn btn-secondary btn-sm" 
        @click="showBulkMode = !showBulkMode"
      >
        {{ showBulkMode ? 'Exit' : 'Enter' }} Bulk Mode
      </button>
    </div>
    
    <div class="plants-gallery">
      <PlantCard
        v-for="plant in paginatedPlants"
        :key="plant.id"
        :plant="plant"
        :bulk-mode="showBulkMode"
        :selected="plantsStore.selectedPlants.has(plant.id)"
        @click="handlePlantClick(plant)"
        @toggle-select="plantsStore.togglePlantSelection(plant.id)"
      />
    </div>
    
    <!-- Pagination controls -->
    <div class="pagination" v-if="totalPages > 1">
      <button 
        class="btn btn-secondary btn-sm" 
        @click="goToPage(1)"
        :disabled="currentPage === 1"
      >
        ⏮️ First
      </button>
      
      <button 
        class="btn btn-secondary btn-sm" 
        @click="goToPage(currentPage - 1)"
        :disabled="currentPage === 1"
      >
        ⬅️ Previous
      </button>
      
      <div class="page-numbers">
        <button
          v-for="page in visiblePages"
          :key="page"
          :class="['btn', 'btn-sm', page === currentPage ? 'btn-primary' : 'btn-secondary']"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
      </div>
      
      <button 
        class="btn btn-secondary btn-sm" 
        @click="goToPage(currentPage + 1)"
        :disabled="currentPage === totalPages"
      >
        Next ➡️
      </button>
      
      <button 
        class="btn btn-secondary btn-sm" 
        @click="goToPage(totalPages)"
        :disabled="currentPage === totalPages"
      >
        Last ⏭️
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlantsStore } from '../stores/plants.js'
import PlantCard from './PlantCard.vue'

const props = defineProps({
  plants: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['show-details'])

const plantsStore = usePlantsStore()
const showBulkMode = ref(false)
const currentPage = ref(1)
const plantsPerPage = ref(12)

// Computed properties for pagination
const totalPages = computed(() => {
  return Math.ceil(props.plants.length / plantsPerPage.value)
})

const paginatedPlants = computed(() => {
  const start = (currentPage.value - 1) * plantsPerPage.value
  const end = start + plantsPerPage.value
  return props.plants.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value
  
  // Show up to 5 page numbers
  let start = Math.max(1, current - 2)
  let end = Math.min(total, start + 4)
  
  // Adjust start if we're near the end
  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// Methods
function handlePlantClick(plant) {
  if (showBulkMode.value) {
    plantsStore.togglePlantSelection(plant.id)
  } else {
    emit('show-details', plant)
  }
}

function goToPage(page) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function selectAllCurrentPage() {
  paginatedPlants.value.forEach(plant => {
    plantsStore.selectedPlants.add(plant.id)
  })
}
</script>