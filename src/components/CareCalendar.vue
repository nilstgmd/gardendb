<template>
  <div class="care-calendar">
    <h4>📅 Upcoming Care Schedule</h4>
    
    <div v-for="(dates, month) in monthlyEvents" :key="month" class="calendar-month">
      <h5>{{ month }}</h5>
      <ul class="care-tasks">
        <li v-for="date in dates" :key="date.toISOString()">
          {{ formatDate(date) }} - {{ getCareTask(plant.type) }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plant: {
    type: Object,
    required: true
  }
})

const monthlyEvents = computed(() => {
  const scheduleMap = {
    'daily': 1,
    'weekly': 7,
    'biweekly': 14,
    'monthly': 30
  }

  const interval = scheduleMap[props.plant.careSchedule] || 7
  const startDate = props.plant.lastCareDate 
    ? new Date(props.plant.lastCareDate) 
    : new Date(props.plant.datePlanted)
  const currentDate = new Date()
  const endDate = new Date(currentDate.getFullYear(), 11, 31) // End of current year

  const careEvents = []
  let nextCareDate = new Date(startDate)
  
  while (nextCareDate <= endDate) {
    nextCareDate.setDate(nextCareDate.getDate() + interval)
    if (nextCareDate >= currentDate) {
      careEvents.push(new Date(nextCareDate))
    }
  }

  // Group by month
  const events = {}
  careEvents.slice(0, 20).forEach(date => { // Limit to 20 events
    const monthKey = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!events[monthKey]) {
      events[monthKey] = []
    }
    events[monthKey].push(date)
  })

  return events
})

function formatDate(date) {
  return date.toLocaleDateString('en-US', { day: 'numeric', weekday: 'short' })
}

function getCareTask(plantType) {
  const tasks = {
    'tomato': 'Water & check for pests',
    'rose': 'Water & deadhead blooms',
    'basil': 'Water & pinch flowers',
    'lettuce': 'Water & harvest leaves',
    'pepper': 'Water & support branches',
    'herb': 'Water & harvest',
    'flower': 'Water & deadhead',
    'vegetable': 'Water & inspect',
    'succulent': 'Check soil moisture',
    'houseplant': 'Water & dust leaves'
  }

  const type = plantType.toLowerCase()
  for (const [key, task] of Object.entries(tasks)) {
    if (type.includes(key)) {
      return task
    }
  }
  return 'General care & watering'
}
</script>