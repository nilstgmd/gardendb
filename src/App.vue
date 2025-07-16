<template>
  <div class="app">
    <div class="container">
      <AppHeader 
        :selected-count="selectedCount"
        @add-plant="showAddModal = true"
        @sort-change="handleSortChange"
        @clear-selection="clearSelection"
        @delete-selected="deleteSelected"
        @export-data="exportData"
        @import-data="importData"
      />
      
      <main>
        <PlantGallery 
          :plants="sortedPlants"
          @show-details="showPlantDetails"
        />
        
        <!-- Visual Care Calendar -->
        <VisualCareCalendar 
          v-if="sortedPlants.length > 0"
          :plants="sortedPlants"
        />
      </main>

      <!-- Add/Edit Plant Modal -->
      <PlantModal
        v-if="showAddModal || editingPlant"
        :plant="editingPlant"
        @close="closeModal"
        @save="handleSavePlant"
      />

      <!-- Plant Details Modal -->
      <PlantDetailsModal
        v-if="selectedPlant"
        :plant="selectedPlant"
        @close="selectedPlant = null"
        @edit="editPlant"
        @delete="deletePlant"
        @update-care="updateCareDate"
      />

      <!-- Storage Warning -->
      <StorageWarning v-if="showStorageWarning" @close="showStorageWarning = false" />
      
      <!-- Error Toast -->
      <ErrorToast 
        v-if="errorMessage" 
        :message="errorMessage" 
        type="error"
        @close="errorMessage = ''" 
      />
      
      <!-- Success Toast -->
      <ErrorToast 
        v-if="successMessage" 
        :message="successMessage" 
        type="success"
        @close="successMessage = ''" 
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlantsStore } from './stores/plants.js'
import AppHeader from './components/AppHeader.vue'
import PlantGallery from './components/PlantGallery.vue'
import PlantModal from './components/PlantModal.vue'
import PlantDetailsModal from './components/PlantDetailsModal.vue'
import StorageWarning from './components/StorageWarning.vue'
import VisualCareCalendar from './components/VisualCareCalendar.vue'
import ErrorToast from './components/ErrorToast.vue'

const plantsStore = usePlantsStore()

// Reactive state
const showAddModal = ref(false)
const editingPlant = ref(null)
const selectedPlant = ref(null)
const showStorageWarning = ref(false)
const currentSort = ref('name')
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const sortedPlants = computed(() => {
  const filtered = plantsStore.getFilteredPlants()
  return plantsStore.getSortedPlants(currentSort.value, filtered)
})

const selectedCount = computed(() => {
  return plantsStore.selectedPlants.size
})

// Methods
function handleSortChange(sortBy) {
  currentSort.value = sortBy
}

function showPlantDetails(plant) {
  selectedPlant.value = plant
}

function editPlant(plant) {
  editingPlant.value = plant
  selectedPlant.value = null
}

function closeModal() {
  showAddModal.value = false
  editingPlant.value = null
}

async function handleSavePlant(plantData) {
  try {
    if (editingPlant.value) {
      await plantsStore.updatePlant(editingPlant.value.id, plantData)
      successMessage.value = `Successfully updated ${plantData.name}!`
    } else {
      await plantsStore.addPlant(plantData)
      successMessage.value = `Successfully added ${plantData.name} to your garden!`
    }
    closeModal()
  } catch (error) {
    if (error.name === 'QuotaExceededError') {
      showStorageWarning.value = true
    } else if (error.message.includes('Duplicate plant')) {
      errorMessage.value = error.message
    } else {
      errorMessage.value = `Failed to save plant: ${error.message}`
    }
  }
}

function deletePlant(plantId) {
  if (confirm('Are you sure you want to delete this plant?')) {
    plantsStore.deletePlant(plantId)
    selectedPlant.value = null
  }
}

function updateCareDate(plantId) {
  plantsStore.updateCareDate(plantId)
}

// Advanced feature methods
function clearSelection() {
  plantsStore.clearSelection()
}

function deleteSelected() {
  if (confirm(`Are you sure you want to delete ${selectedCount.value} selected plants?`)) {
    plantsStore.deleteSelectedPlants()
  }
}

function exportData() {
  try {
    plantsStore.exportToMarkdown()
  } catch (error) {
    console.error('Export failed:', error)
    alert('Export failed. Please try again.')
  }
}

function importData() {
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = '.md,.txt'
  input.onchange = async (e) => {
    const file = e.target.files[0]
    if (file) {
      try {
        const importedCount = await plantsStore.importFromMarkdown(file)
        successMessage.value = `Successfully imported ${importedCount} plants!`
      } catch (error) {
        console.error('Import failed:', error)
        errorMessage.value = `Import failed: ${error.message}. Please check the file format and try again.`
      }
    }
  }
  input.click()
}

// Initialize
onMounted(() => {
  plantsStore.loadPlants()
})
</script>