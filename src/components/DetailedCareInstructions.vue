<template>
  <div class="detailed-care">
    <div class="care-detail-item">
      <div class="care-detail-label">💧 Watering:</div>
      <div class="care-detail-value">{{ careInstructions.watering }}</div>
    </div>
    <div class="care-detail-item">
      <div class="care-detail-label">☀️ Sunlight:</div>
      <div class="care-detail-value">{{ careInstructions.sunlight }}</div>
    </div>
    <div class="care-detail-item">
      <div class="care-detail-label">🌱 Soil:</div>
      <div class="care-detail-value">{{ careInstructions.soil }}</div>
    </div>
    <div class="care-detail-item">
      <div class="care-detail-label">🌿 Fertilizing:</div>
      <div class="care-detail-value">{{ careInstructions.fertilizing }}</div>
    </div>
    <div class="care-detail-item">
      <div class="care-detail-label">✂️ Pruning:</div>
      <div class="care-detail-value">{{ careInstructions.pruning }}</div>
    </div>
    <div class="care-detail-item">
      <div class="care-detail-label">🐛 Pests:</div>
      <div class="care-detail-value">{{ careInstructions.pests }}</div>
    </div>
    <div v-if="careInstructions.harvest" class="care-detail-item">
      <div class="care-detail-label">🌾 Harvest:</div>
      <div class="care-detail-value">{{ careInstructions.harvest }}</div>
    </div>
    
    <div class="care-source">
      <strong>Source:</strong> 
      <a :href="careSource.url" target="_blank">{{ careSource.name }}</a>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  plantName: {
    type: String,
    required: true
  },
  plantType: {
    type: String,
    required: true
  }
})

const careInstructions = computed(() => {
  return getDetailedCareInstructions(props.plantName, props.plantType)
})

const careSource = computed(() => {
  return getCareSource(props.plantType)
})

function getDetailedCareInstructions(plantName, plantType) {
  const detailedCareGuide = {
    'tomato': {
      watering: 'Water deeply 1-2 inches per week. Water at soil level to prevent disease.',
      sunlight: 'Full sun (6-8 hours daily)',
      soil: 'Well-draining, slightly acidic soil (pH 6.0-6.8)',
      fertilizing: 'Feed with balanced fertilizer every 2-3 weeks during growing season',
      pruning: 'Remove suckers and lower leaves. Stake or cage for support.',
      pests: 'Watch for hornworms, aphids, and whiteflies',
      diseases: 'Prevent blight by avoiding overhead watering',
      harvest: 'Pick when fruits are fully colored but still firm'
    },
    'basil': {
      watering: 'Keep soil consistently moist but not waterlogged',
      sunlight: 'Full sun to partial shade (4-6 hours daily)',
      soil: 'Well-draining, fertile soil with good organic matter',
      fertilizing: 'Light feeding with balanced fertilizer monthly',
      pruning: 'Pinch flowers to encourage leaf growth. Harvest regularly.',
      pests: 'Watch for aphids and spider mites',
      diseases: 'Ensure good air circulation to prevent fungal issues',
      harvest: 'Pick leaves regularly, harvest before flowering for best flavor'
    },
    'rose': {
      watering: 'Deep watering 1-2 times per week. Water at base, avoid leaves.',
      sunlight: 'Full sun (6+ hours daily)',
      soil: 'Well-draining, rich soil with pH 6.0-7.0',
      fertilizing: 'Feed with rose fertilizer in spring and mid-summer',
      pruning: 'Prune in late winter/early spring. Deadhead spent blooms.',
      pests: 'Monitor for aphids, thrips, and Japanese beetles',
      diseases: 'Watch for black spot, powdery mildew, and rust',
      harvest: 'Cut flowers early morning when buds are just opening'
    },
    'lettuce': {
      watering: 'Keep soil consistently moist. Light, frequent watering.',
      sunlight: 'Partial shade to full sun (4-6 hours)',
      soil: 'Cool, moist, well-draining soil rich in organic matter',
      fertilizing: 'Light nitrogen feeding every 2-3 weeks',
      pruning: 'Harvest outer leaves first, allowing center to continue growing',
      pests: 'Watch for slugs, snails, and aphids',
      diseases: 'Prevent rot with good drainage and air circulation',
      harvest: 'Pick outer leaves when 4-6 inches long'
    }
  }

  const plantKey = plantName.toLowerCase()
  for (const [key, care] of Object.entries(detailedCareGuide)) {
    if (plantKey.includes(key)) {
      return care
    }
  }

  // Fallback to basic care by type
  const basicCareByType = {
    'vegetable': {
      watering: 'Water consistently, about 1 inch per week',
      sunlight: 'Full sun (6-8 hours daily)',
      soil: 'Well-draining, fertile soil',
      fertilizing: 'Regular feeding during growing season',
      pruning: 'Remove dead or diseased parts',
      pests: 'Monitor regularly for common garden pests',
      diseases: 'Ensure good air circulation',
      harvest: 'Harvest when mature for best flavor'
    },
    'herb': {
      watering: 'Water when top inch of soil is dry',
      sunlight: 'Full sun to partial shade',
      soil: 'Well-draining soil, not too rich',
      fertilizing: 'Light feeding monthly',
      pruning: 'Regular harvesting encourages growth',
      pests: 'Generally pest-resistant',
      diseases: 'Avoid overwatering to prevent root rot',
      harvest: 'Pick regularly for best flavor'
    },
    'flower': {
      watering: 'Water at soil level, avoid wetting leaves',
      sunlight: 'Varies by species, most prefer full sun',
      soil: 'Well-draining soil with organic matter',
      fertilizing: 'Balanced fertilizer during growing season',
      pruning: 'Deadhead spent blooms to encourage more flowers',
      pests: 'Monitor for aphids and spider mites',
      diseases: 'Good air circulation prevents fungal issues',
      harvest: 'Cut flowers early morning for longest vase life'
    },
    'houseplant': {
      watering: 'Water when top inch of soil is dry',
      sunlight: 'Bright, indirect light for most species',
      soil: 'Well-draining potting mix',
      fertilizing: 'Monthly feeding during growing season',
      pruning: 'Remove dead or yellowing leaves',
      pests: 'Watch for spider mites, aphids, and scale',
      diseases: 'Avoid overwatering to prevent root rot',
      harvest: 'Not applicable for most houseplants'
    },
    'succulent': {
      watering: 'Water deeply but infrequently. Allow soil to dry completely.',
      sunlight: 'Bright light, some direct sun',
      soil: 'Fast-draining cactus/succulent mix',
      fertilizing: 'Light feeding 2-3 times during growing season',
      pruning: 'Remove dead or damaged parts',
      pests: 'Watch for mealybugs and scale insects',
      diseases: 'Overwatering is the main cause of problems',
      harvest: 'Not applicable'
    }
  }

  const typeKey = plantType.toLowerCase()
  for (const [key, care] of Object.entries(basicCareByType)) {
    if (typeKey.includes(key)) {
      return care
    }
  }

  return basicCareByType['herb'] // Default fallback
}

function getCareSource(plantType) {
  const sources = {
    'tomato': { name: 'Gardening Know How', url: 'https://www.gardeningknowhow.com/edible/vegetables/tomato/' },
    'rose': { name: 'American Rose Society', url: 'https://www.rose.org/' },
    'basil': { name: 'The Spruce', url: 'https://www.thespruce.com/how-to-grow-basil-1403421' },
    'lettuce': { name: 'Burpee Seeds', url: 'https://www.burpee.com/vegetables/lettuce/' },
    'pepper': { name: 'Gardening Know How', url: 'https://www.gardeningknowhow.com/edible/vegetables/pepper/' },
    'herb': { name: 'Herb Society of America', url: 'https://www.herbsociety.org/' },
    'flower': { name: 'Better Homes & Gardens', url: 'https://www.bhg.com/gardening/flowers/' },
    'vegetable': { name: 'Old Farmer\'s Almanac', url: 'https://www.almanac.com/gardening/vegetables' },
    'succulent': { name: 'Succulent Plant Care', url: 'https://www.succulentsandsunshine.com/' },
    'houseplant': { name: 'The Sill', url: 'https://www.thesill.com/blogs/care-miscellaneous' }
  }

  const type = plantType.toLowerCase()
  for (const [key, source] of Object.entries(sources)) {
    if (type.includes(key)) {
      return source
    }
  }
  return { name: 'General Gardening Resources', url: 'https://www.gardeningknowhow.com/' }
}
</script>