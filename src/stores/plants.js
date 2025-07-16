import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const usePlantsStore = defineStore('plants', () => {
  // State
  const plants = ref([])
  const selectedPlants = ref(new Set())
  const searchQuery = ref('')
  const weatherData = ref(null)
  const lastWeatherUpdate = ref(null)
  
  // Plant database for autocomplete
  const plantDatabase = [
    // Vegetables
    'Tomato', 'Cherry Tomato', 'Beefsteak Tomato', 'Roma Tomato',
    'Bell Pepper', 'Jalapeño Pepper', 'Habanero Pepper', 'Sweet Pepper',
    'Lettuce', 'Romaine Lettuce', 'Iceberg Lettuce', 'Butter Lettuce',
    'Spinach', 'Kale', 'Arugula', 'Swiss Chard',
    'Carrot', 'Radish', 'Beet', 'Turnip',
    'Cucumber', 'Zucchini', 'Yellow Squash', 'Butternut Squash',
    'Broccoli', 'Cauliflower', 'Brussels Sprouts', 'Cabbage',
    'Onion', 'Garlic', 'Shallot', 'Leek',
    'Potato', 'Sweet Potato', 'Eggplant',
    
    // Herbs
    'Basil', 'Sweet Basil', 'Thai Basil', 'Purple Basil',
    'Oregano', 'Thyme', 'Rosemary', 'Sage',
    'Parsley', 'Cilantro', 'Chives', 'Dill',
    'Mint', 'Spearmint', 'Peppermint', 'Chocolate Mint',
    'Lavender', 'Chamomile', 'Lemon Balm',
    
    // Flowers
    'Rose', 'Hybrid Tea Rose', 'Climbing Rose', 'Shrub Rose',
    'Sunflower', 'Marigold', 'Petunia', 'Impatiens',
    'Geranium', 'Begonia', 'Pansy', 'Viola',
    'Zinnia', 'Cosmos', 'Nasturtium', 'Sweet Pea',
    'Dahlia', 'Tulip', 'Daffodil', 'Hyacinth',
    'Lily', 'Iris', 'Peony', 'Hydrangea',
    
    // Houseplants
    'Pothos', 'Golden Pothos', 'Marble Queen Pothos',
    'Snake Plant', 'Rubber Plant', 'Fiddle Leaf Fig',
    'Monstera', 'Monstera Deliciosa', 'Peace Lily',
    'Spider Plant', 'ZZ Plant', 'Philodendron',
    'Aloe Vera', 'Jade Plant', 'String of Pearls',
    'Boston Fern', 'Maidenhair Fern', 'Bird of Paradise',
    
    // Succulents
    'Echeveria', 'Sedum', 'Haworthia', 'Crassula',
    'Aeonium', 'Kalanchoe', 'Lithops', 'Barrel Cactus',
    'Prickly Pear Cactus', 'Christmas Cactus', 'Easter Cactus',
    
    // Fruits
    'Strawberry', 'Blueberry', 'Raspberry', 'Blackberry',
    'Apple Tree', 'Pear Tree', 'Cherry Tree', 'Peach Tree',
    'Lemon Tree', 'Orange Tree', 'Lime Tree', 'Grapefruit Tree'
  ]

  // Getters
  function getSortedPlants(sortBy, filteredPlants = null) {
    const plantsCopy = [...(filteredPlants || plants.value)]
    
    switch (sortBy) {
      case 'name':
        return plantsCopy.sort((a, b) => a.name.localeCompare(b.name))
      case 'age':
        return plantsCopy.sort((a, b) => new Date(a.datePlanted) - new Date(b.datePlanted))
      case 'attention':
        return plantsCopy.sort((a, b) => {
          const aNeeds = needsAttention(a)
          const bNeeds = needsAttention(b)
          if (aNeeds && !bNeeds) return -1
          if (!aNeeds && bNeeds) return 1
          return a.name.localeCompare(b.name)
        })
      case 'date':
        return plantsCopy.sort((a, b) => new Date(b.datePlanted) - new Date(a.datePlanted))
      default:
        return plantsCopy
    }
  }

  const getPlantSuggestions = computed(() => {
    return (query) => {
      if (!query || query.length < 2) return []
      return plantDatabase.filter(plant => 
        plant.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8)
    }
  })

  // Actions
  function loadPlants() {
    try {
      const stored = localStorage.getItem('gardenPlants')
      if (stored) {
        plants.value = JSON.parse(stored)
      }
    } catch (error) {
      console.error('Error loading plants:', error)
    }
  }

  function savePlants() {
    try {
      const plantsForStorage = plants.value.map(plant => {
        const plantCopy = { ...plant }
        if (plant.photo && plant.photo.length > 50000) {
          delete plantCopy.photo
        }
        return plantCopy
      })
      
      localStorage.setItem('gardenPlants', JSON.stringify(plantsForStorage))
    } catch (error) {
      if (error.name === 'QuotaExceededError') {
        const plantsWithoutPhotos = plants.value.map(plant => {
          const { photo, ...plantWithoutPhoto } = plant
          return plantWithoutPhoto
        })
        localStorage.setItem('gardenPlants', JSON.stringify(plantsWithoutPhotos))
        throw error
      }
    }
  }

  async function addPlant(plantData) {
    // Check for duplicates
    const duplicate = findDuplicatePlant(plantData)
    if (duplicate) {
      throw new Error(`Duplicate plant detected: "${duplicate.name}" already exists with the same type and location.`)
    }

    const plant = {
      id: Date.now(),
      ...plantData,
      lastCareDate: null,
      healthStatus: 'healthy', // healthy, needs-attention, sick
      growthMilestones: [],
      careHistory: []
    }
    
    plants.value.push(plant)
    savePlants()
  }

  async function updatePlant(id, plantData) {
    const index = plants.value.findIndex(p => p.id === id)
    if (index !== -1) {
      plants.value[index] = { ...plants.value[index], ...plantData }
      savePlants()
    }
  }

  function deletePlant(id) {
    const index = plants.value.findIndex(p => p.id === id)
    if (index !== -1) {
      plants.value.splice(index, 1)
      savePlants()
    }
  }

  function updateCareDate(id) {
    const plant = plants.value.find(p => p.id === id)
    if (plant) {
      plant.lastCareDate = new Date().toISOString().split('T')[0]
      savePlants()
    }
  }

  // Helper functions
  function calculateAge(datePlanted) {
    const planted = new Date(datePlanted)
    const now = new Date()
    const diffTime = Math.abs(now - planted)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays < 30) {
      return `${diffDays} days`
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30)
      return `${months} month${months > 1 ? 's' : ''}`
    } else {
      const years = Math.floor(diffDays / 365)
      const remainingMonths = Math.floor((diffDays % 365) / 30)
      return `${years} year${years > 1 ? 's' : ''}${remainingMonths > 0 ? `, ${remainingMonths} month${remainingMonths > 1 ? 's' : ''}` : ''}`
    }
  }

  function needsAttention(plant) {
    const nextCare = getNextCareDate(plant)
    return typeof nextCare === 'object' && nextCare.isOverdue
  }

  function getNextCareDate(plant) {
    if (!plant.lastCareDate) {
      return 'Care needed - no previous care recorded'
    }

    const lastCare = new Date(plant.lastCareDate)
    const scheduleMap = {
      'daily': 1,
      'weekly': 7,
      'biweekly': 14,
      'monthly': 30
    }

    const daysToAdd = scheduleMap[plant.careSchedule] || 7
    const nextCare = new Date(lastCare)
    nextCare.setDate(nextCare.getDate() + daysToAdd)

    const today = new Date()
    const isOverdue = nextCare < today
    
    return {
      date: nextCare.toLocaleDateString(),
      isOverdue,
      daysUntil: Math.ceil((nextCare - today) / (1000 * 60 * 60 * 24))
    }
  }

  async function getPlantImage(plantType) {
    const imageMap = {
      'tomato': 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=400&h=300&fit=crop',
      'rose': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'basil': 'https://images.unsplash.com/photo-1618375569909-3c8616cf7733?w=400&h=300&fit=crop',
      'lettuce': 'https://images.unsplash.com/photo-1622206151226-18ca2c9ab4a1?w=400&h=300&fit=crop',
      'pepper': 'https://images.unsplash.com/photo-1583663848850-46af132dc08e?w=400&h=300&fit=crop',
      'herb': 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=400&h=300&fit=crop',
      'flower': 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=300&fit=crop',
      'vegetable': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=300&fit=crop',
      'succulent': 'https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?w=400&h=300&fit=crop',
      'houseplant': 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'
    }

    const type = plantType.toLowerCase()
    for (const [key, url] of Object.entries(imageMap)) {
      if (type.includes(key)) {
        return url
      }
    }
    return 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop'
  }

  // Advanced Features
  function findDuplicatePlant(plantData) {
    return plants.value.find(plant => 
      plant.name.toLowerCase() === plantData.name.toLowerCase() &&
      plant.type.toLowerCase() === plantData.type.toLowerCase() &&
      (plant.location || '').toLowerCase() === (plantData.location || '').toLowerCase()
    )
  }

  function getFilteredPlants() {
    let filtered = plants.value
    
    // Apply search filter
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(plant =>
        plant.name.toLowerCase().includes(query) ||
        plant.type.toLowerCase().includes(query) ||
        (plant.location || '').toLowerCase().includes(query) ||
        (plant.notes || '').toLowerCase().includes(query)
      )
    }
    
    return filtered
  }

  function updateHealthStatus(plantId, status) {
    const plant = plants.value.find(p => p.id === plantId)
    if (plant) {
      plant.healthStatus = status
      savePlants()
    }
  }

  function addGrowthMilestone(plantId, milestone) {
    const plant = plants.value.find(p => p.id === plantId)
    if (plant) {
      if (!plant.growthMilestones) plant.growthMilestones = []
      plant.growthMilestones.push({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        description: milestone,
        timestamp: Date.now()
      })
      savePlants()
    }
  }

  function addCareRecord(plantId, careType, notes = '') {
    const plant = plants.value.find(p => p.id === plantId)
    if (plant) {
      if (!plant.careHistory) plant.careHistory = []
      plant.careHistory.push({
        id: Date.now(),
        date: new Date().toISOString().split('T')[0],
        type: careType,
        notes,
        timestamp: Date.now()
      })
      plant.lastCareDate = new Date().toISOString().split('T')[0]
      savePlants()
    }
  }

  // Bulk operations
  function togglePlantSelection(plantId) {
    if (selectedPlants.value.has(plantId)) {
      selectedPlants.value.delete(plantId)
    } else {
      selectedPlants.value.add(plantId)
    }
  }

  function selectAllPlants() {
    const filtered = getFilteredPlants()
    filtered.forEach(plant => selectedPlants.value.add(plant.id))
  }

  function clearSelection() {
    selectedPlants.value.clear()
  }

  function deleteSelectedPlants() {
    const idsToDelete = Array.from(selectedPlants.value)
    plants.value = plants.value.filter(plant => !idsToDelete.includes(plant.id))
    selectedPlants.value.clear()
    savePlants()
  }

  // Export/Import functionality
  function exportToMarkdown() {
    const markdown = generateMarkdownExport()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `garden-export-${new Date().toISOString().split('T')[0]}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function generateMarkdownExport() {
    const now = new Date().toLocaleDateString()
    let markdown = `# 🌿 Garden Export - ${now}\n\n`
    
    plants.value.forEach(plant => {
      const age = calculateAge(plant.datePlanted)
      const nextCare = getNextCareDate(plant)
      
      markdown += `## ${plant.name}\n\n`
      markdown += `- **Type:** ${plant.type}\n`
      markdown += `- **Age:** ${age}\n`
      markdown += `- **Planted:** ${new Date(plant.datePlanted).toLocaleDateString()}\n`
      markdown += `- **Health Status:** ${plant.healthStatus || 'healthy'}\n`
      
      if (plant.location) markdown += `- **Location:** ${plant.location}\n`
      if (plant.notes) markdown += `- **Notes:** ${plant.notes}\n`
      
      markdown += `- **Care Schedule:** ${plant.careSchedule}\n`
      if (plant.lastCareDate) {
        markdown += `- **Last Care:** ${new Date(plant.lastCareDate).toLocaleDateString()}\n`
      }
      
      if (typeof nextCare === 'object') {
        markdown += `- **Next Care:** ${nextCare.date} (${nextCare.isOverdue ? 'Overdue' : `in ${nextCare.daysUntil} days`})\n`
      } else {
        markdown += `- **Next Care:** ${nextCare}\n`
      }
      
      if (plant.growthMilestones && plant.growthMilestones.length > 0) {
        markdown += `\n### Growth Timeline\n\n`
        plant.growthMilestones.forEach(milestone => {
          markdown += `- **${new Date(milestone.date).toLocaleDateString()}:** ${milestone.description}\n`
        })
      }
      
      if (plant.careHistory && plant.careHistory.length > 0) {
        markdown += `\n### Care History\n\n`
        plant.careHistory.slice(-5).forEach(record => {
          markdown += `- **${new Date(record.date).toLocaleDateString()}:** ${record.type}`
          if (record.notes) markdown += ` - ${record.notes}`
          markdown += `\n`
        })
      }
      
      markdown += `\n---\n\n`
    })
    
    return markdown
  }

  async function importFromMarkdown(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const content = e.target.result
          const importedPlants = parseMarkdownImport(content)
          
          // Add imported plants
          importedPlants.forEach(plantData => {
            const plant = {
              id: Date.now() + Math.random(),
              ...plantData,
              healthStatus: plantData.healthStatus || 'healthy',
              growthMilestones: plantData.growthMilestones || [],
              careHistory: plantData.careHistory || []
            }
            plants.value.push(plant)
          })
          
          savePlants()
          resolve(importedPlants.length)
        } catch (error) {
          reject(error)
        }
      }
      reader.onerror = reject
      reader.readAsText(file)
    })
  }

  function parseMarkdownImport(content) {
    if (!content || typeof content !== 'string') {
      throw new Error('Invalid file content. Please provide a valid markdown file.')
    }
    
    const plants = []
    const sections = content.split('## ').slice(1) // Remove header
    
    if (sections.length === 0) {
      throw new Error('No plants found in the file. Please check the markdown format.')
    }
    
    sections.forEach((section, index) => {
      try {
        const lines = section.split('\n').filter(line => line.trim())
        const name = lines[0]?.trim()
        
        if (!name) {
          console.warn(`Skipping section ${index + 1}: No plant name found`)
          return
        }
        
        const plant = { name, careSchedule: 'weekly' } // Default care schedule
        
        lines.forEach(line => {
          const trimmedLine = line.trim()
          if (trimmedLine.includes('**Type:**')) {
            plant.type = trimmedLine.split('**Type:**')[1]?.trim()
          }
          if (trimmedLine.includes('**Planted:**')) {
            const dateStr = trimmedLine.split('**Planted:**')[1]?.trim()
            if (dateStr) {
              const parsedDate = new Date(dateStr)
              if (!isNaN(parsedDate.getTime())) {
                plant.datePlanted = parsedDate.toISOString().split('T')[0]
              }
            }
          }
          if (trimmedLine.includes('**Location:**')) {
            plant.location = trimmedLine.split('**Location:**')[1]?.trim()
          }
          if (trimmedLine.includes('**Notes:**')) {
            plant.notes = trimmedLine.split('**Notes:**')[1]?.trim()
          }
          if (trimmedLine.includes('**Care Schedule:**')) {
            const schedule = trimmedLine.split('**Care Schedule:**')[1]?.trim()
            if (['daily', 'weekly', 'biweekly', 'monthly'].includes(schedule)) {
              plant.careSchedule = schedule
            }
          }
          if (trimmedLine.includes('**Health Status:**')) {
            const status = trimmedLine.split('**Health Status:**')[1]?.trim()
            if (['healthy', 'needs-attention', 'sick'].includes(status)) {
              plant.healthStatus = status
            }
          }
        })
        
        // Validate required fields
        if (!plant.type) {
          console.warn(`Skipping ${name}: Missing plant type`)
          return
        }
        
        if (!plant.datePlanted) {
          console.warn(`Skipping ${name}: Missing or invalid planted date`)
          return
        }
        
        plants.push(plant)
      } catch (error) {
        console.warn(`Error parsing section ${index + 1}:`, error.message)
      }
    })
    
    if (plants.length === 0) {
      throw new Error('No valid plants could be imported. Please check the file format and ensure plants have both type and planted date.')
    }
    
    return plants
  }

  // Weather integration
  async function fetchWeatherData(location = 'auto') {
    try {
      // For demo purposes, return mock weather data
      // To enable real weather: 
      // 1. Get API key from https://openweathermap.org/api
      // 2. Replace mock data with actual API call
      const mockWeatherData = {
        main: { temp: 22, humidity: 65 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        name: location === 'auto' ? 'Your Location' : location
      }
      
      weatherData.value = mockWeatherData
      lastWeatherUpdate.value = Date.now()
      return weatherData.value
      
      // Uncomment below for real API (replace YOUR_API_KEY):
      // const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=YOUR_API_KEY&units=metric`)
      // if (response.ok) {
      //   weatherData.value = await response.json()
      //   lastWeatherUpdate.value = Date.now()
      //   return weatherData.value
      // }
    } catch (error) {
      console.error('Weather fetch failed:', error)
    }
    return null
  }

  function getSeasonalRecommendations() {
    const month = new Date().getMonth()
    const season = getSeason(month)
    
    const recommendations = {
      spring: [
        'Start seeds indoors for warm-season crops',
        'Begin hardening off seedlings',
        'Prepare garden beds with compost',
        'Plant cool-season vegetables',
        'Prune roses and fruit trees'
      ],
      summer: [
        'Water deeply and regularly',
        'Mulch around plants to retain moisture',
        'Harvest vegetables regularly',
        'Deadhead flowers to encourage blooming',
        'Watch for pests and diseases'
      ],
      fall: [
        'Plant spring-blooming bulbs',
        'Harvest and preserve crops',
        'Clean up garden debris',
        'Plant cover crops',
        'Prepare tender plants for winter'
      ],
      winter: [
        'Plan next year\'s garden',
        'Order seeds and plants',
        'Maintain houseplants',
        'Protect outdoor plants from frost',
        'Service and clean garden tools'
      ]
    }
    
    return recommendations[season] || []
  }

  function getSeason(month) {
    if (month >= 2 && month <= 4) return 'spring'
    if (month >= 5 && month <= 7) return 'summer'
    if (month >= 8 && month <= 10) return 'fall'
    return 'winter'
  }

  function getWeatherBasedCareAdjustments() {
    if (!weatherData.value) return []
    
    const adjustments = []
    const temp = weatherData.value.main?.temp || 20
    const humidity = weatherData.value.main?.humidity || 50
    const weather = weatherData.value.weather?.[0]?.main?.toLowerCase() || ''
    
    if (temp > 30) {
      adjustments.push('🌡️ High temperature: Increase watering frequency and provide shade')
    }
    
    if (temp < 5) {
      adjustments.push('❄️ Low temperature: Protect tender plants and reduce watering')
    }
    
    if (weather.includes('rain')) {
      adjustments.push('🌧️ Rainy weather: Reduce watering schedule and check for fungal issues')
    }
    
    if (humidity < 30) {
      adjustments.push('🏜️ Low humidity: Increase misting for houseplants and check soil moisture')
    }
    
    return adjustments
  }

  return {
    // State
    plants,
    selectedPlants,
    searchQuery,
    weatherData,
    plantDatabase,
    
    // Getters
    getSortedPlants,
    getPlantSuggestions,
    getFilteredPlants,
    
    // Actions
    loadPlants,
    addPlant,
    updatePlant,
    deletePlant,
    updateCareDate,
    
    // Advanced Features
    findDuplicatePlant,
    updateHealthStatus,
    addGrowthMilestone,
    addCareRecord,
    
    // Bulk Operations
    togglePlantSelection,
    selectAllPlants,
    clearSelection,
    deleteSelectedPlants,
    
    // Export/Import
    exportToMarkdown,
    importFromMarkdown,
    
    // Weather Integration
    fetchWeatherData,
    getSeasonalRecommendations,
    getWeatherBasedCareAdjustments,
    
    // Helper functions
    calculateAge,
    needsAttention,
    getNextCareDate,
    getPlantImage
  }
})