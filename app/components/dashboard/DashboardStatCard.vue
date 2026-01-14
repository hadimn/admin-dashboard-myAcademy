<!-- components/DashboardStatCard.vue -->
<template>
  <UCard>
    <div class="flex items-center">
      <div class="flex justify-center items-center shrink-0">
        <div class="flex justify-center items-center rounded-lg bg-primary-100 p-3">
          <UIcon :name="stat.icon" class="h-6 w-6 text-primary-600" />
        </div>
      </div>
      <div class="ml-4">
        <p class="text-sm font-medium text-muted">{{ stat.name }}</p>
        <div class="flex items-baseline">
          <p class="text-2xl font-semibold text-highlighted">{{ stat.value }}</p>
          <p
            class="ml-2 text-sm font-medium"
            :class="[
              stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
            ]"
          >
            {{ stat.change }}
          </p>
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { StatItem } from '~/composables/useDashboardStats'

defineProps<{
  stat: StatItem
}>()
</script>