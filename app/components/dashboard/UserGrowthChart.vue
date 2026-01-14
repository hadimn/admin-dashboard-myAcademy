<script setup lang="ts">
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface UserGrowth {
  date: string
  new_users: number
  total_users: number
}

interface Props {
  data: readonly UserGrowth[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const colorMode = useColorMode()

const chartData = computed(() => {
  if (!props.data || props.data.length === 0) {
    return {
      labels: [],
      datasets: []
    }
  }

  return {
    labels: props.data.map(item => {
      const date = new Date(item.date)
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }),
    datasets: [
      {
        label: 'New Users',
        data: props.data.map(item => item.new_users),
        backgroundColor: 'rgba(59, 130, 246, 0.7)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1,
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
      labels: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#4b5563',
        usePointStyle: true,
        padding: 15,
      }
    },
    tooltip: {
      backgroundColor: colorMode.value === 'dark' ? '#1f2937' : '#ffffff',
      titleColor: colorMode.value === 'dark' ? '#f9fafb' : '#111827',
      bodyColor: colorMode.value === 'dark' ? '#e5e7eb' : '#374151',
      borderColor: colorMode.value === 'dark' ? '#374151' : '#e5e7eb',
      borderWidth: 1,
      padding: 12,
    }
  },
  scales: {
    x: {
      grid: {
        color: colorMode.value === 'dark' ? '#374151' : '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
      }
    },
    y: {
      grid: {
        color: colorMode.value === 'dark' ? '#374151' : '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
        stepSize: 1,
      }
    }
  }
}))
</script>

<template>
  <div class="relative" style="height: 300px;">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-default/50 backdrop-blur-sm rounded-lg">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>
    
    <div v-else-if="!data || data.length === 0" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-users" class="w-12 h-12 text-muted mx-auto mb-2" />
        <p class="text-muted">No user growth data available</p>
      </div>
    </div>
    
    <Bar v-else :data="chartData" :options="chartOptions" />
  </div>
</template>