<script setup lang="ts">
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

interface RevenueData {
  date: string
  amount: number
  enrollments: number
}

interface Props {
  data: readonly RevenueData[]
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
        label: 'Revenue',
        data: props.data.map(item => item.amount),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4,
      },
      {
        label: 'Enrollments',
        data: props.data.map(item => item.enrollments),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4,
        yAxisID: 'y1',
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
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
      displayColors: true,
      callbacks: {
        label: function(context: any) {
          let label = context.dataset.label || ''
          if (label) {
            label += ': '
          }
          if (context.parsed.y !== null) {
            if (context.dataset.label === 'Revenue') {
              label += '$' + context.parsed.y.toFixed(2)
            } else {
              label += context.parsed.y
            }
          }
          return label
        }
      }
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
      type: 'linear' as const,
      display: true,
      position: 'left' as const,
      grid: {
        color: colorMode.value === 'dark' ? '#374151' : '#f3f4f6',
        drawBorder: false,
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
        callback: function(value: any) {
          return '$' + value
        }
      }
    },
    y1: {
      type: 'linear' as const,
      display: true,
      position: 'right' as const,
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        color: colorMode.value === 'dark' ? '#9ca3af' : '#6b7280',
      }
    },
  }
}))
</script>

<template>
  <div class="relative" style="height: 350px;">
    <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-default/50 backdrop-blur-sm rounded-lg">
      <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
    </div>
    
    <div v-else-if="!data || data.length === 0" class="absolute inset-0 flex items-center justify-center">
      <div class="text-center">
        <UIcon name="i-heroicons-chart-bar" class="w-12 h-12 text-muted mx-auto mb-2" />
        <p class="text-muted">No revenue data available</p>
      </div>
    </div>
    
    <Line v-else :data="chartData" :options="chartOptions" />
  </div>
</template>