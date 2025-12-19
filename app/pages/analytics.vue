<!-- pages/analytics.vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-highlighted">Analytics</h1>
      <p class="mt-2 text-muted">Detailed analytics and insights</p>
    </div>

    <div class="grid gap-6">
      <!-- Analytics Filters -->
      <UCard>
        <div class="flex flex-wrap items-center gap-4">
          <USelect v-model="selectedMetric" :options="metrics" label="Metric" />
          <USelect v-model="selectedDateRange" :options="dateRanges" label="Date Range" />
          <UInput v-model="customDate" type="date" label="Custom Date" />
          <UButton label="Export Data" icon="i-heroicons-arrow-down-tray" />
        </div>
      </UCard>

      <!-- Analytics Charts Grid -->
      <div class="grid gap-6 lg:grid-cols-2">
        <UCard v-for="chart in charts" :key="chart.id">
          <template #header>
            <h3 class="text-lg font-semibold text-highlighted">{{ chart.title }}</h3>
          </template>
          <div class="h-64">
            <!-- Chart placeholder -->
            <div class="flex h-full items-center justify-center border-2 border-dashed border-default rounded-lg">
              <p class="text-muted">{{ chart.title }} Chart</p>
            </div>
          </div>
        </UCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const selectedMetric = ref('revenue')
const selectedDateRange = ref('30days')
const customDate = ref('')

const metrics = ['revenue', 'users', 'sessions', 'conversion']
const dateRanges = ['7days', '30days', '90days', 'year']

const charts = [
  { id: 1, title: 'Revenue Trends' },
  { id: 2, title: 'User Growth' },
  { id: 3, title: 'Traffic Sources' },
  { id: 4, title: 'Conversion Funnel' },
]
</script>
