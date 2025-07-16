<template>
  <div class="plant-growth-timeline">
    <div class="timeline-header">
      <h4>📈 Growth Timeline</h4>
      <button 
        class="btn btn-secondary btn-sm" 
        @click="showAddMilestone = true"
      >
        Add Milestone
      </button>
    </div>
    
    <div v-if="milestones.length === 0" class="no-milestones">
      <p>No growth milestones recorded yet.</p>
      <p class="hint">Add milestones to track your plant's progress!</p>
    </div>
    
    <div v-else class="timeline">
      <div class="timeline-item planted">
        <div class="timeline-marker planted-marker">🌱</div>
        <div class="timeline-content">
          <div class="timeline-date">{{ plantedDate }}</div>
          <div class="timeline-title">Plant was planted</div>
          <div class="timeline-description">Beginning of growth journey</div>
        </div>
      </div>
      
      <div 
        v-for="milestone in sortedMilestones" 
        :key="milestone.id"
        class="timeline-item"
      >
        <div class="timeline-marker">{{ getMilestoneIcon(milestone.description) }}</div>
        <div class="timeline-content">
          <div class="timeline-date">{{ formatDate(milestone.date) }}</div>
          <div class="timeline-title">{{ milestone.description }}</div>
          <div class="timeline-age">{{ getAgeAtMilestone(milestone.date) }}</div>
        </div>
      </div>
      
      <div class="timeline-item current">
        <div class="timeline-marker current-marker">🌿</div>
        <div class="timeline-content">
          <div class="timeline-date">{{ currentDate }}</div>
          <div class="timeline-title">Current status</div>
          <div class="timeline-description">{{ currentAge }} old</div>
        </div>
      </div>
    </div>
    
    <!-- Add Milestone Modal -->
    <div v-if="showAddMilestone" class="modal" @click="closeAddMilestone">
      <div class="modal-content modal-sm" @click.stop>
        <span class="close" @click="closeAddMilestone">&times;</span>
        <h3>Add Growth Milestone</h3>
        
        <form @submit.prevent="addMilestone">
          <div class="form-group">
            <label>Milestone Type:</label>
            <div class="milestone-input-options">
              <label class="radio-option">
                <input type="radio" v-model="inputMode" value="preset" />
                <span>Choose from presets</span>
              </label>
              <label class="radio-option">
                <input type="radio" v-model="inputMode" value="freetext" />
                <span>Write custom description</span>
              </label>
            </div>
          </div>

          <div v-if="inputMode === 'preset'" class="form-group">
            <label>Select Milestone:</label>
            <select v-model="newMilestone.description" required>
              <option value="">Select milestone type...</option>
              <option value="First sprout emerged">🌱 First sprout emerged</option>
              <option value="First true leaves">🍃 First true leaves</option>
              <option value="Transplanted outdoors">🏡 Transplanted outdoors</option>
              <option value="First flower bud">🌸 First flower bud</option>
              <option value="First bloom">🌺 First bloom</option>
              <option value="First fruit/harvest">🍅 First fruit/harvest</option>
              <option value="Pruned/trimmed">✂️ Pruned/trimmed</option>
              <option value="Repotted">🪴 Repotted</option>
              <option value="Fertilized">🌿 Fertilized</option>
              <option value="Pest treatment">🐛 Pest treatment</option>
              <option value="Disease treatment">💊 Disease treatment</option>
              <option value="Growth spurt">📈 Growth spurt</option>
              <option value="Dormancy period">😴 Dormancy period</option>
              <option value="Watered thoroughly">💧 Watered thoroughly</option>
              <option value="New growth spotted">🌿 New growth spotted</option>
              <option value="Moved to new location">📍 Moved to new location</option>
            </select>
          </div>
          
          <div v-if="inputMode === 'freetext'" class="form-group">
            <label>Custom Description:</label>
            <input 
              v-model="newMilestone.customDescription" 
              type="text" 
              placeholder="e.g., Started showing yellow leaves, Grew 5cm this week..."
              required
            />
          </div>
          
          <div class="form-group">
            <label>Date:</label>
            <input v-model="newMilestone.date" type="date" required>
          </div>
          
          <button type="submit" class="btn btn-primary">Add Milestone</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { usePlantsStore } from '../stores/plants.js'

const props = defineProps({
  plant: {
    type: Object,
    required: true
  }
})

const plantsStore = usePlantsStore()
const showAddMilestone = ref(false)
const inputMode = ref('preset')
const newMilestone = ref({
  description: '',
  customDescription: '',
  date: new Date().toISOString().split('T')[0]
})

const milestones = computed(() => {
  return props.plant.growthMilestones || []
})

const sortedMilestones = computed(() => {
  return [...milestones.value].sort((a, b) => new Date(a.date) - new Date(b.date))
})

const plantedDate = computed(() => {
  return formatDate(props.plant.datePlanted)
})

const currentDate = computed(() => {
  return formatDate(new Date().toISOString().split('T')[0])
})

const currentAge = computed(() => {
  return plantsStore.calculateAge(props.plant.datePlanted)
})

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

function getAgeAtMilestone(milestoneDate) {
  const planted = new Date(props.plant.datePlanted)
  const milestone = new Date(milestoneDate)
  const diffTime = Math.abs(milestone - planted)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays < 30) {
    return `${diffDays} days after planting`
  } else if (diffDays < 365) {
    const months = Math.floor(diffDays / 30)
    return `${months} month${months > 1 ? 's' : ''} after planting`
  } else {
    const years = Math.floor(diffDays / 365)
    return `${years} year${years > 1 ? 's' : ''} after planting`
  }
}

function getMilestoneIcon(description) {
  const iconMap = {
    'First sprout emerged': '🌱',
    'First true leaves': '🍃',
    'Transplanted outdoors': '🏡',
    'First flower bud': '🌸',
    'First bloom': '🌺',
    'First fruit/harvest': '🍅',
    'Pruned/trimmed': '✂️',
    'Repotted': '🪴',
    'Fertilized': '🌿',
    'Pest treatment': '🐛',
    'Disease treatment': '💊',
    'Growth spurt': '📈',
    'Dormancy period': '😴'
  }
  
  return iconMap[description] || '📍'
}

function closeAddMilestone() {
  showAddMilestone.value = false
  newMilestone.value = {
    description: '',
    customDescription: '',
    date: new Date().toISOString().split('T')[0]
  }
}

function addMilestone() {
  const description = inputMode.value === 'freetext' 
    ? newMilestone.value.customDescription 
    : newMilestone.value.description
    
  plantsStore.addGrowthMilestone(props.plant.id, description)
  closeAddMilestone()
}
</script>

<style scoped>
.plant-growth-timeline {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(52, 73, 58, 0.08);
  border-radius: 6px;
  padding: 20px;
  margin-top: 15px;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.timeline-header h4 {
  color: #2c3e35;
  margin: 0;
}

.no-milestones {
  text-align: center;
  padding: 40px 20px;
  color: #6b7c72;
}

.hint {
  font-size: 0.9rem;
  margin-top: 8px;
}

.timeline {
  position: relative;
  padding-left: 30px;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 15px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #52735a, rgba(52, 73, 58, 0.3));
}

.timeline-item {
  position: relative;
  margin-bottom: 25px;
}

.timeline-marker {
  position: absolute;
  left: -22px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #52735a;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

.planted-marker {
  border-color: #4CAF50;
  background: rgba(76, 175, 80, 0.1);
}

.current-marker {
  border-color: #2196F3;
  background: rgba(33, 150, 243, 0.1);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.timeline-content {
  background: rgba(255, 255, 255, 0.8);
  padding: 15px;
  border-radius: 8px;
  border-left: 3px solid #52735a;
}

.timeline-item.planted .timeline-content {
  border-left-color: #4CAF50;
}

.timeline-item.current .timeline-content {
  border-left-color: #2196F3;
}

.timeline-date {
  font-size: 0.85rem;
  color: #52735a;
  font-weight: 500;
  margin-bottom: 5px;
}

.timeline-title {
  font-weight: 500;
  color: #2c3e35;
  margin-bottom: 5px;
}

.timeline-description,
.timeline-age {
  font-size: 0.9rem;
  color: #6b7c72;
}

.modal-sm {
  max-width: 400px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

.milestone-input-options {
  display: flex;
  gap: 15px;
  margin-top: 8px;
}

.radio-option {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  color: #2c3e35;
}

.radio-option input[type="radio"] {
  margin: 0;
  width: auto;
}
</style>