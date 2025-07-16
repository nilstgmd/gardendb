<template>
  <div class="visual-care-calendar">
    <h4>📅 Visual Care Timeline</h4>
    
    <div class="calendar-controls">
      <button 
        class="btn btn-secondary btn-sm" 
        @click="currentMonth = Math.max(0, currentMonth - 1)"
        :disabled="currentMonth === 0"
      >
        ← Previous
      </button>
      <span class="current-month">{{ monthNames[currentMonth] }} {{ currentYear }}</span>
      <button 
        class="btn btn-secondary btn-sm" 
        @click="currentMonth = Math.min(11, currentMonth + 1)"
        :disabled="currentMonth === 11"
      >
        Next →
      </button>
    </div>
    
    <div class="calendar-grid">
      <div class="calendar-header">
        <div v-for="day in dayNames" :key="day" class="day-header">{{ day }}</div>
      </div>
      
      <div class="calendar-body">
        <div 
          v-for="day in calendarDays" 
          :key="day.date" 
          :class="['calendar-day', {
            'other-month': !day.isCurrentMonth,
            'today': day.isToday,
            'has-care': day.careEvents.length > 0,
            'overdue': day.hasOverdue
          }]"
        >
          <div class="day-number">{{ day.dayNumber }}</div>
          <div class="care-events">
            <div 
              v-for="event in day.careEvents.slice(0, 3)" 
              :key="event.plantId"
              :class="['care-event', `care-${event.type}`]"
              :title="`${event.plantName} - ${event.careType}`"
            >
              {{ event.plantName.substring(0, 8) }}{{ event.plantName.length > 8 ? '...' : '' }}
            </div>
            <div v-if="day.careEvents.length > 3" class="more-events">
              +{{ day.careEvents.length - 3 }} more
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <div class="calendar-legend">
      <div class="legend-item">
        <div class="legend-color care-watering"></div>
        <span>Watering</span>
      </div>
      <div class="legend-item">
        <div class="legend-color care-fertilizing"></div>
        <span>Fertilizing</span>
      </div>
      <div class="legend-item">
        <div class="legend-color care-pruning"></div>
        <span>Pruning</span>
      </div>
      <div class="legend-item">
        <div class="legend-color care-overdue"></div>
        <span>Overdue</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlantsStore } from '../stores/plants.js'

const props = defineProps({
  plants: {
    type: Array,
    required: true
  }
})

const plantsStore = usePlantsStore()
const currentMonth = ref(new Date().getMonth())
const currentYear = ref(new Date().getFullYear())

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const calendarDays = computed(() => {
  const firstDay = new Date(currentYear.value, currentMonth.value, 1)
  const lastDay = new Date(currentYear.value, currentMonth.value + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  const today = new Date()
  
  for (let i = 0; i < 42; i++) { // 6 weeks
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    
    const careEvents = getCareEventsForDate(date)
    
    days.push({
      date: date.toISOString().split('T')[0],
      dayNumber: date.getDate(),
      isCurrentMonth: date.getMonth() === currentMonth.value,
      isToday: date.toDateString() === today.toDateString(),
      careEvents,
      hasOverdue: careEvents.some(event => event.isOverdue)
    })
  }
  
  return days
})

function getCareEventsForDate(date) {
  const events = []
  const dateStr = date.toISOString().split('T')[0]
  
  props.plants.forEach(plant => {
    const nextCare = plantsStore.getNextCareDate(plant)
    
    if (typeof nextCare === 'object' && nextCare.date) {
      // Parse date more reliably to avoid timezone issues
      const [month, day, year] = nextCare.date.split('/')
      const careDate = new Date(year, month - 1, day) // months are 0-indexed
      const careDateStr = careDate.getFullYear() + '-' + 
        String(careDate.getMonth() + 1).padStart(2, '0') + '-' + 
        String(careDate.getDate()).padStart(2, '0')
      if (careDateStr === dateStr) {
        events.push({
          plantId: plant.id,
          plantName: plant.name,
          careType: getCareTypeForPlant(plant),
          type: nextCare.isOverdue ? 'overdue' : 'scheduled',
          isOverdue: nextCare.isOverdue
        })
      }
    }
  })
  
  return events
}

function getCareTypeForPlant(plant) {
  // Determine care type based on plant type and schedule
  const type = plant.type.toLowerCase()
  if (type.includes('succulent')) return 'watering'
  if (type.includes('flower')) return 'watering'
  if (type.includes('vegetable')) return 'watering'
  return 'watering'
}
</script>

<style scoped>
.visual-care-calendar {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(52, 73, 58, 0.08);
  border-radius: 6px;
  padding: 20px;
  margin-top: 20px;
}

.calendar-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.current-month {
  font-weight: 500;
  color: #2c3e35;
}

.calendar-grid {
  border: 1px solid rgba(52, 73, 58, 0.1);
  border-radius: 6px;
  overflow: hidden;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background: rgba(52, 73, 58, 0.05);
}

.day-header {
  padding: 10px;
  text-align: center;
  font-weight: 500;
  color: #52735a;
  font-size: 0.9rem;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-day {
  min-height: 80px;
  padding: 8px;
  border: 1px solid rgba(52, 73, 58, 0.05);
  position: relative;
  background: rgba(255, 255, 255, 0.8);
}

.calendar-day.other-month {
  background: rgba(255, 255, 255, 0.3);
  color: #999;
}

.calendar-day.today {
  background: rgba(52, 73, 58, 0.1);
  border-color: #52735a;
}

.calendar-day.has-care {
  background: rgba(76, 175, 80, 0.1);
}

.calendar-day.overdue {
  background: rgba(244, 67, 54, 0.1);
}

.day-number {
  font-weight: 500;
  margin-bottom: 4px;
}

.care-events {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.care-event {
  font-size: 0.7rem;
  padding: 2px 4px;
  border-radius: 3px;
  color: white;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
}

.care-watering {
  background: #2196F3;
}

.care-fertilizing {
  background: #4CAF50;
}

.care-pruning {
  background: #FF9800;
}

.care-overdue {
  background: #f44336;
}

.more-events {
  font-size: 0.6rem;
  color: #666;
  text-align: center;
}

.calendar-legend {
  display: flex;
  gap: 15px;
  margin-top: 15px;
  flex-wrap: wrap;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.85rem;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}
</style>