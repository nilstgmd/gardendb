<template>
  <div class="weather-integration">
    <div class="weather-header">
      <h4>🌤️ Weather & Care Recommendations</h4>
      <button 
        class="btn btn-secondary btn-sm" 
        @click="refreshWeather"
        :disabled="loading"
      >
        {{ loading ? '⏳' : '🔄' }} Refresh
      </button>
    </div>
    
    <div v-if="weatherData" class="weather-info">
      <div class="current-weather">
        <div class="weather-main">
          <div class="temperature">{{ Math.round(weatherData.main.temp) }}°C</div>
          <div class="weather-desc">{{ weatherData.weather[0].description }}</div>
          <div class="location">{{ weatherData.name }}</div>
        </div>
        <div class="weather-details">
          <div class="detail-item">
            <span class="detail-label">Humidity:</span>
            <span class="detail-value">{{ weatherData.main.humidity }}%</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Feels like:</span>
            <span class="detail-value">{{ Math.round(weatherData.main.feels_like) }}°C</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">Wind:</span>
            <span class="detail-value">{{ weatherData.wind?.speed || 0 }} m/s</span>
          </div>
        </div>
      </div>
    </div>
    
    <div v-else-if="!loading" class="weather-placeholder">
      <p>🌍 Weather data helps optimize plant care timing</p>
      <p class="weather-note">Note: Weather integration requires an API key</p>
    </div>
    
    <div v-if="loading" class="loading">
      <p>Loading weather data...</p>
    </div>
    
    <!-- Weather-based recommendations -->
    <div class="weather-recommendations">
      <h5>🎯 Today's Care Recommendations</h5>
      
      <div v-if="weatherAdjustments.length > 0" class="adjustments">
        <div 
          v-for="adjustment in weatherAdjustments" 
          :key="adjustment"
          class="adjustment-item"
        >
          {{ adjustment }}
        </div>
      </div>
      
      <div v-else class="no-adjustments">
        <p>✅ Normal care schedule recommended for current weather conditions</p>
      </div>
    </div>
    
    <!-- Seasonal recommendations -->
    <div class="seasonal-recommendations">
      <h5>🍂 {{ currentSeason }} Care Tips</h5>
      
      <ul class="seasonal-tips">
        <li v-for="tip in seasonalTips" :key="tip">
          {{ tip }}
        </li>
      </ul>
    </div>
    
    <!-- Mock weather toggle for demo -->
    <div class="demo-controls" v-if="!weatherData">
      <button class="btn btn-secondary btn-sm" @click="loadMockWeather">
        🎭 Load Demo Weather
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { usePlantsStore } from '../stores/plants.js'

const plantsStore = usePlantsStore()
const loading = ref(false)

const weatherData = computed(() => plantsStore.weatherData)
const weatherAdjustments = computed(() => plantsStore.getWeatherBasedCareAdjustments())
const seasonalTips = computed(() => plantsStore.getSeasonalRecommendations())

const currentSeason = computed(() => {
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Fall'
  return 'Winter'
})

async function refreshWeather() {
  loading.value = true
  try {
    // Try to get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords
          await plantsStore.fetchWeatherData(`${latitude},${longitude}`)
          loading.value = false
        },
        () => {
          // Fallback to default location
          loadMockWeather()
          loading.value = false
        }
      )
    } else {
      loadMockWeather()
      loading.value = false
    }
  } catch (error) {
    console.error('Weather fetch failed:', error)
    loadMockWeather()
    loading.value = false
  }
}

function loadMockWeather() {
  // Mock weather data for demo purposes
  plantsStore.weatherData = {
    name: 'Your Location',
    main: {
      temp: 22,
      feels_like: 24,
      humidity: 65
    },
    weather: [{
      main: 'Clear',
      description: 'clear sky'
    }],
    wind: {
      speed: 3.2
    }
  }
}

onMounted(() => {
  // Load seasonal recommendations immediately
  // Weather data is optional and loaded on demand
})
</script>

<style scoped>
.weather-integration {
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(52, 73, 58, 0.08);
  border-radius: 6px;
  padding: 20px;
  margin-top: 15px;
}

.weather-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.weather-header h4 {
  color: #2c3e35;
  margin: 0;
}

.current-weather {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 8px;
}

.weather-main {
  text-align: center;
}

.temperature {
  font-size: 2.5rem;
  font-weight: 300;
  color: #2c3e35;
  margin-bottom: 5px;
}

.weather-desc {
  font-size: 1rem;
  color: #52735a;
  text-transform: capitalize;
  margin-bottom: 5px;
}

.location {
  font-size: 0.9rem;
  color: #6b7c72;
}

.weather-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-label {
  color: #6b7c72;
  font-size: 0.9rem;
}

.detail-value {
  color: #2c3e35;
  font-weight: 500;
}

.weather-placeholder,
.loading {
  text-align: center;
  padding: 30px;
  color: #6b7c72;
}

.weather-note {
  font-size: 0.85rem;
  margin-top: 8px;
  color: #999;
}

.weather-recommendations,
.seasonal-recommendations {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(52, 73, 58, 0.1);
}

.weather-recommendations h5,
.seasonal-recommendations h5 {
  color: #2c3e35;
  margin-bottom: 15px;
  font-size: 1rem;
}

.adjustments {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.adjustment-item {
  background: rgba(255, 193, 7, 0.1);
  border-left: 3px solid #ffc107;
  padding: 10px 15px;
  border-radius: 4px;
  font-size: 0.9rem;
  color: #2c3e35;
}

.no-adjustments {
  color: #52735a;
  font-size: 0.9rem;
}

.seasonal-tips {
  list-style: none;
  padding: 0;
  margin: 0;
}

.seasonal-tips li {
  background: rgba(52, 73, 58, 0.05);
  padding: 10px 15px;
  margin: 8px 0;
  border-radius: 4px;
  border-left: 3px solid #52735a;
  font-size: 0.9rem;
  color: #2c3e35;
}

.demo-controls {
  margin-top: 15px;
  text-align: center;
  padding-top: 15px;
  border-top: 1px solid rgba(52, 73, 58, 0.1);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.85rem;
}

@media (max-width: 768px) {
  .current-weather {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
</style>