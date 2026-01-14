<script setup lang="ts">
const props = defineProps<{
  rows?: number
}>()

const rows = props.rows || 10
</script>

<template>
  <div class="space-y-4 animate-pulse">
    <!-- Header Skeleton -->
    <div class="flex justify-between items-center">
      <div class="space-y-2">
        <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-48"></div>
        <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      </div>
      <div class="flex gap-2">
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-10"></div>
      </div>
    </div>

    <!-- Tabs Skeleton -->
    <div class="flex gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
    </div>

    <!-- Search and Stats Skeleton -->
    <div class="flex justify-between items-center">
      <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded w-64"></div>
      <div class="flex gap-4">
        <div class="h-20 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
        <div class="h-20 bg-gray-200 dark:bg-gray-700 rounded w-32"></div>
      </div>
    </div>

    <!-- Table Skeleton -->
    <div class="space-y-3">
      <!-- Table Header -->
      <div class="grid grid-cols-4 gap-4">
        <div v-for="i in 4" :key="i" class="h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
      
      <!-- Table Rows -->
      <div v-for="i in rows" :key="i" class="grid grid-cols-4 gap-4">
        <div v-for="j in 4" :key="j" class="h-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  </div>
</template>