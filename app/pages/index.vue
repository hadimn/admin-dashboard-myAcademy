<script setup lang="ts">
definePageMeta({
  layout: 'default',
  title: 'Dashboard'
})

const {
  stats,
  revenueData,
  topCourses,
  recentEnrollments,
  userGrowth,
  loading,
  totalRevenue,
  revenueGrowth,
  userGrowthPercentage,
  fetchDashboardData
} = useDashboardAnalytics()

// Define the type
type Period = 'day' | 'week' | 'month' | 'year'

// Update the ref
const selectedPeriod = ref<Period>('month')

// Update periodOptions with proper typing
const periodOptions = [
  { label: 'Today', value: 'day' as const },
  { label: 'This Week', value: 'week' as const },
  { label: 'This Month', value: 'month' as const },
  { label: 'This Year', value: 'year' as const }
]

// Fetch data on mount
onMounted(() => {
  fetchDashboardData(selectedPeriod.value)
})

// Watch period changes
watch(selectedPeriod, (newPeriod) => {
  fetchDashboardData(newPeriod)
})

// Stat cards configuration
const statCards = computed(() => [
  {
    id: 'revenue',
    name: 'Total Revenue',
    value: totalRevenue.value,
    change: revenueGrowth.value,
    changeType: revenueGrowth.value.startsWith('+') ? 'increase' : 'decrease',
    icon: 'i-heroicons-currency-dollar',
    color: 'primary' as const
  },
  {
    id: 'users',
    name: 'Total Users',
    value: stats.value?.total_users?.toString() || '0',
    change: userGrowthPercentage.value,
    changeType: userGrowthPercentage.value.startsWith('+') ? 'increase' : 'decrease',
    icon: 'i-heroicons-users',
    color: 'primary' as const
  },
  {
    id: 'enrollments',
    name: 'Total Enrollments',
    value: stats.value?.total_enrollments?.toString() || '0',
    change: '+12%',
    changeType: 'increase' as const,
    icon: 'i-heroicons-academic-cap',
    color: 'primary' as const
  },
  {
    id: 'active',
    name: 'Active Today',
    value: stats.value?.active_users_today?.toString() || '0',
    change: 'Live',
    changeType: 'increase' as const,
    icon: 'i-heroicons-clock',
    color: 'primary' as const
  }
])

// Recent enrollments table columns
const enrollmentColumns = [
  { key: 'user_name', label: 'User', id: 'user_name' },
  { key: 'course_title', label: 'Course', id: 'course_title' },
  { key: 'amount_paid', label: 'Amount', id: 'amount_paid' },
  { key: 'payment_status', label: 'Status', id: 'payment_status' },
  { key: 'enrolled_at', label: 'Date', id: 'enrolled_at' }
]

// Top courses table columns
const courseColumns = [
  { key: 'title', label: 'Course', id: 'title' },
  { key: 'enrollments', label: 'Enrollments', id: 'enrollments' },
  { key: 'revenue', label: 'Revenue', id: 'revenue' },
  { key: 'completion_rate', label: 'Completion', id: 'completion_rate' }
]

// Format functions
const formatAmount = (amount: number | string | null | undefined) => {
  const value = Number(amount)
  return `$${Number.isFinite(value) ? value.toFixed(2) : '0.00'}`
}


const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatPercentage = (value: number | string | null | undefined) => {
  const num = Number(value)
  return `${Number.isFinite(num) ? num.toFixed(1) : '0'}%`
}

type BadgeColor = 'neutral' | 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error'


const getStatusColor = (status: string): BadgeColor => {
  const colors: Record<string, string> = {
    paid: 'success',      // ✅ Valid semantic color
    pending: 'warning',   // ✅ Use 'warning' instead of 'amber'
    failed: 'error',      // ✅ Use 'error' instead of 'red'
    refunded: 'neutral',  // ✅ Use 'neutral' instead of 'gray'
    canceled: 'neutral'   // ✅ Use 'neutral' instead of 'gray'
  }
  return colors[status] as BadgeColor || 'neutral'
}

// Format enrollment data for table
const formattedEnrollments = computed(() => {
  return recentEnrollments.value.map(enrollment => ({
    ...enrollment,
    amount_paid: formatAmount(enrollment.amount_paid),
    enrolled_at: formatDate(enrollment.enrolled_at)
  }))
})

// Format course data for table
const formattedCourses = computed(() => {
  return topCourses.value.map(course => ({
    ...course,
    revenue: formatAmount(course.revenue),
    completion_rate: formatPercentage(course.completion_rate)
  }))
})

// Quick stats
const quickStats = computed(() => [
  {
    label: 'Completed Courses',
    value: stats.value?.completed_courses || 0,
    icon: 'i-heroicons-check-circle',
    color: 'green' as const
  },
  {
    label: 'Pending Payments',
    value: stats.value?.pending_payments || 0,
    icon: 'i-heroicons-clock',
    color: 'amber' as const
  },
  {
    label: 'Badges Earned',
    value: stats.value?.total_badges_earned || 0,
    icon: 'i-simple-line-icons-badge',
    color: 'purple' as const
  },
  {
    label: 'Total Courses',
    value: stats.value?.total_courses || 0,
    icon: 'i-heroicons-book-open',
    color: 'blue' as const
  }
])
</script>

<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold text-highlighted">Dashboard</h1>
        <p class="mt-2 text-muted">Welcome back! Here's what's happening with your platform.</p>
      </div>

      <USelect v-model="selectedPeriod" :items="periodOptions" size="md" class="w-full sm:w-48" />
    </div>

    <!-- Main Stats Grid -->
    <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <UCard v-for="stat in statCards" :key="stat.id" class="relative overflow-hidden p-5">
        <!-- Icon -->
        <div :class="`bg-${stat.color}-100 dark:bg-${stat.color}-900/20`"
          class="absolute right-4 top-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <UIcon :name="stat.icon" class="h-6 w-6" :class="`text-${stat.color}-600 dark:text-${stat.color}-400`" />
        </div>

        <!-- Content -->
        <div class="space-y-2">
          <p class="text-sm font-medium text-muted">
            {{ stat.name }}
          </p>

          <p class="text-3xl font-bold text-highlighted">
            {{ stat.value }}
          </p>

          <!-- Change Indicator -->
          <div class="flex items-center gap-1 text-sm">
            <UIcon :name="stat.changeType === 'increase'
              ? 'i-heroicons-arrow-trending-up'
              : 'i-heroicons-arrow-trending-down'" class="h-4 w-4" :class="stat.changeType === 'increase'
                ? 'text-green-500'
                : 'text-red-500'" />

            <span class="font-medium" :class="stat.changeType === 'increase'
              ? 'text-green-600 dark:text-green-400'
              : 'text-red-600 dark:text-red-400'">
              {{ stat.change }}
            </span>

            <span class="text-xs text-muted">
              vs last period
            </span>
          </div>
        </div>
      </UCard>
    </div>


    <!-- Charts Section -->
    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Revenue Chart (Takes 2 columns) -->
      <UCard class="lg:col-span-2">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-highlighted">Revenue & Enrollments Overview</h3>
            <UBadge color="primary" variant="soft">{{ selectedPeriod }}</UBadge>
          </div>
        </template>
        <ClientOnly>
          <DashboardRevenueChart :data="revenueData" :loading="loading" />
          <template #fallback>
            <div class="flex items-center justify-center h-80">
              <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
            </div>
          </template>
        </ClientOnly>
      </UCard>

      <!-- Quick Stats -->
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold text-highlighted">Quick Stats</h3>
        </template>
        <div class="space-y-4">
          <div v-for="quickStat in quickStats" :key="quickStat.label"
            class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
            <div class="flex items-center gap-3">
              <div :class="`bg-${quickStat.color}-100 dark:bg-${quickStat.color}-900/20 p-2 rounded-lg`">
                <UIcon :name="quickStat.icon" :class="`text-${quickStat.color}-600 dark:text-${quickStat.color}-400`"
                  class="w-5 h-5" />
              </div>
              <span class="text-sm font-medium text-default">{{ quickStat.label }}</span>
            </div>
            <span class="text-xl font-bold text-highlighted">{{ quickStat.value }}</span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- User Growth Chart -->
    <UCard>
      <template #header>
        <h3 class="text-lg font-semibold text-highlighted">User Growth</h3>
      </template>
      <ClientOnly>
        <DashboardUserGrowthChart :data="userGrowth" :loading="loading" />
        <template #fallback>
          <div class="flex items-center justify-center h-64">
            <UIcon name="i-heroicons-arrow-path" class="w-8 h-8 animate-spin text-primary" />
          </div>
        </template>
      </ClientOnly>
    </UCard>

    <!-- Tables Section -->
    <div class="grid gap-6 lg:grid-cols-2">
      <!-- Recent Enrollments -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-highlighted">Recent Enrollments</h3>
            <UButton to="/enrollments" variant="ghost" size="xs" trailing-icon="i-heroicons-arrow-right">
              View All
            </UButton>
          </div>
        </template>

        <div v-if="loading" class="space-y-3">
          <USkeleton v-for="i in 5" :key="i" class="h-12" />
        </div>

        <div v-else-if="formattedEnrollments.length === 0" class="text-center py-8">
          <UIcon name="i-heroicons-inbox" class="w-12 h-12 text-muted mx-auto mb-2" />
          <p class="text-muted">No recent enrollments</p>
        </div>

        <div v-else class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead>
              <tr>
                <th class="px-3 py-2 text-left text-xs font-medium text-muted uppercase">User</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-muted uppercase">Course</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-muted uppercase">Amount</th>
                <th class="px-3 py-2 text-left text-xs font-medium text-muted uppercase">Status</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-for="enrollment in formattedEnrollments.slice(0, 5)" :key="enrollment.enrollment_id"
                class="hover:bg-muted/30">
                <td class="px-3 py-3 text-sm text-default">{{ enrollment.user_name }}</td>
                <td class="px-3 py-3 text-sm text-default truncate max-w-[150px]">{{ enrollment.course_title }}</td>
                <td class="px-3 py-3 text-sm font-medium text-highlighted">{{ enrollment.amount_paid }}</td>
                <td class="px-3 py-3">
                  <UBadge :color="getStatusColor(enrollment.payment_status)" variant="soft" size="xs">
                    {{ enrollment.payment_status }}
                  </UBadge>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </UCard>

      <!-- Top Courses -->
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-highlighted">Top Performing Courses</h3>
            <UButton to="/courses" variant="ghost" size="xs" trailing-icon="i-heroicons-arrow-right">
              View All
            </UButton>
          </div>
        </template>

        <div v-if="loading" class="space-y-3">
          <USkeleton v-for="i in 5" :key="i" class="h-12" />
        </div>

        <div v-else-if="formattedCourses.length === 0" class="text-center py-8">
          <UIcon name="i-heroicons-academic-cap" class="w-12 h-12 text-muted mx-auto mb-2" />
          <p class="text-muted">No course data available</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="(course, index) in formattedCourses.slice(0, 5)" :key="course.course_id"
            class="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
            <div class="flex items-center gap-3 flex-1 min-w-0">
              <div class="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <span class="text-sm font-bold text-primary">{{ index + 1 }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-default truncate">{{ course.title }}</p>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-xs text-muted">{{ course.enrollments }} enrollments</span>
                  <span class="text-xs text-muted">•</span>
                  <span class="text-xs text-green-600 dark:text-green-400">{{ course.completion_rate }} complete</span>
                </div>
              </div>
            </div>
            <span class="text-sm font-bold text-highlighted ml-2">{{ course.revenue }}</span>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>