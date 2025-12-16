<!-- components/AdminNavbar.vue -->
<template>
  <header class="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 sm:px-6 lg:px-8">
    <!-- Sidebar Toggle -->
    <UButton icon="i-heroicons-bars-3" color="neutral" variant="ghost" class="lg:hidden"
      @click="$emit('toggleSidebar')" />

    <!-- Search -->
    <div class="flex-1">
      <UInput placeholder="Search..." icon="i-heroicons-magnifying-glass" color="neutral" class="max-w-md" />
    </div>

    <!-- Notifications & Actions -->
    <div class="flex items-center gap-2">
      <UButton icon="i-heroicons-bell" color="neutral" variant="ghost" :badge="3" />

      <UDropdownMenu :items="notificationItems">
        <UButton icon="i-heroicons-ellipsis-vertical" color="neutral" variant="ghost" />
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
defineEmits<{
  toggleSidebar: []
}>()

const notificationItems = [
  [{
    label: 'View all notifications',
    icon: 'i-heroicons-bell'
  }],
  [{
    label: 'Mark all as read',
    icon: 'i-heroicons-check'
  }]
]
</script>