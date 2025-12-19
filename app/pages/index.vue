<script setup lang="ts">
definePageMeta({
  layout: 'default',
})

import { useDashboardStats, type StatItem } from '~/composables/useDashboardStats'

const { stats } = useDashboardStats()

const selectedPeriod = ref('month')
const periodOptions = ['day', 'week', 'month', 'year']

const recentOrders = [
  { id: '1', customer: 'John Doe', amount: '$250.00', status: 'completed', date: '2024-01-15' },
  { id: '2', customer: 'Jane Smith', amount: '$150.00', status: 'pending', date: '2024-01-14' },
  { id: '3', customer: 'Bob Johnson', amount: '$350.00', status: 'processing', date: '2024-01-13' },
  { id: '4', customer: 'Alice Brown', amount: '$450.00', status: 'completed', date: '2024-01-12' },
]

const orderColumns = [
  { key: 'customer', label: 'Customer', id: 'customer' },
  { key: 'amount', label: 'Amount', id: 'amount' },
  { key: 'status', label: 'Status', id: 'status' },
  { key: 'date', label: 'Date', id: 'date' },
]

const topProducts = [
  { name: 'Premium Widget', sales: 234, revenue: '$4,680' },
  { name: 'Basic Widget', sales: 189, revenue: '$2,835' },
  { name: 'Deluxe Widget', sales: 156, revenue: '$5,460' },
  { name: 'Standard Widget', sales: 98, revenue: '$1,470' },
]

const productColumns = [
  { key: 'name', label: 'Product', id: 'name' },
  { key: 'sales', label: 'Sales', id: 'sales' },
  { key: 'revenue', label: 'Revenue', id: 'revenue' },
]
</script>

<template>
  <div class="p-6">
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-highlighted">Dashboard</h1>
      <p class="mt-2 text-muted">Welcome back! Here's what's happening with your store today.</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      <DashboardStatCard v-for="stat in stats" :key="stat.id" :stat="stat" />
    </div>

    <!-- Charts & Tables -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Revenue Chart -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-highlighted">Revenue Overview</h3>
            <USelect v-model="selectedPeriod" :options="periodOptions" color="neutral" size="sm" />
          </div>
        </template>
        <div class="h-80">
          <!-- Chart would go here -->
          <div class="flex h-full items-center justify-center border-2 border-dashed border-default rounded-lg">
            <p class="text-muted">Chart Component Placeholder</p>
          </div>
        </div>
      </UCard>

      <!-- Recent Orders -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-highlighted">Recent Orders</h3>
        </template>
        <UTable :rows="recentOrders" :columns="orderColumns" />
      </UCard>

      <!-- Top Products -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-highlighted">Top Products</h3>
        </template>
        <UTable :rows="topProducts" :columns="productColumns" />
      </UCard>
    </div>
  </div>
</template>
