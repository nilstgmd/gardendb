<template>
  <header>
    <div class="header-left">
      <h1>🌿 Garden</h1>
      <p class="header-subtitle">Your personal plant sanctuary</p>
    </div>
    
    <div class="header-center">
      <div class="search-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search plants..."
          class="search-input"
          @input="handleSearch"
        >
        <span class="search-icon">🔍</span>
      </div>
    </div>
    
    <div class="header-controls">
      <div class="sort-controls">
        <label for="sort-by">Sort by:</label>
        <select id="sort-by" v-model="sortBy" @change="$emit('sort-change', sortBy)">
          <option value="name">Name</option>
          <option value="age">Age</option>
          <option value="attention">Needs Attention</option>
          <option value="date">Date Planted</option>
          <option value="health">Health Status</option>
        </select>
      </div>
      
      <div class="bulk-controls" v-if="selectedCount > 0">
        <span class="selected-count">{{ selectedCount }} selected</span>
        <button class="btn btn-secondary btn-sm" @click="$emit('clear-selection')">
          Clear
        </button>
        <button class="btn btn-danger btn-sm" @click="$emit('delete-selected')">
          Delete Selected
        </button>
      </div>
      
      <div class="action-buttons">
        <button class="btn btn-secondary" @click="$emit('export-data')">
          📤 Export
        </button>
        <button class="btn btn-secondary" @click="$emit('import-data')">
          📥 Import
        </button>
        <button class="btn btn-primary" @click="$emit('add-plant')">
          Add Plant
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { usePlantsStore } from '../stores/plants.js'

const props = defineProps({
  selectedCount: {
    type: Number,
    default: 0
  }
})

defineEmits([
  'add-plant', 
  'sort-change', 
  'clear-selection', 
  'delete-selected', 
  'export-data', 
  'import-data'
])

const plantsStore = usePlantsStore()
const sortBy = ref('name')
const searchQuery = ref('')

function handleSearch() {
  plantsStore.searchQuery = searchQuery.value
}
</script>