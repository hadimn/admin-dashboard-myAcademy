<script setup lang="ts">
import type { Admin } from '~/composables/useAdminAuth'

const route = useRoute();

const navigation = [
  { name: "Dashboard", to: "/", icon: "i-heroicons-home" },
  { name: "courses", to: "/courses", icon: "i-hugeicons-course" },
  { name: "badges", to: "/badges", icon: "i-simple-line-icons-badge" },
  { name: "Analytics", to: "/analytics", icon: "i-heroicons-chart-bar" },
  { name: "Users", to: "/users", icon: "i-heroicons-users", badge: "24" },
  { name: "Settings", to: "/settings", icon: "i-heroicons-cog-6-tooth" },
];

const props = defineProps<{
  isOpen: boolean;
  admin: Admin | null;
  loading?: boolean;
}>();

const emit = defineEmits<{
  close: []
  logout: []
}>();

// Fixed: Use onSelect instead of click
const userMenuItems = [
  [
    {
      label: "Profile",
      icon: "i-heroicons-user",
      onSelect: () => {
        console.log("Profile clicked");
      },
    },
    {
      label: "Settings",
      icon: "i-heroicons-cog-6-tooth",
      onSelect: async () => {
        try {
          await navigateTo("/settings");
        } catch (error) {
          console.error("Navigation to settings failed:", error);
        }
      },
    },
  ],
  [
    {
      label: "Sign out",
      icon: "i-heroicons-arrow-left-on-rectangle",
      onSelect: () => {
        emit('logout');
      },
    },
  ],
];
</script>

<template>
  <!-- Fixed: Remove ClientOnly and use v-show for overlay to avoid hydration issues -->
  <div v-show="props.isOpen" class="fixed inset-0 z-40 bg-gray-600/50 lg:hidden" @click="emit('close')" />

  <aside
    class="fixed inset-y-0 left-0 z-50 w-72 flex-col border-r border-gray-200 bg-white transition-transform duration-200 lg:flex"
    :class="[
      'lg:translate-x-0',
      'transform',
      props.isOpen ? 'translate-x-0' : '-translate-x-full',
    ]">

    <!-- Logo -->
    <div class="flex h-16 items-center border-b border-gray-200 px-6">
      <!-- Close button for mobile -->
      <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" class="lg:hidden" @click="emit('close')" />

      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-primary-600" />
        <span class="text-xl font-bold text-gray-900">AdminDash</span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 space-y-1 p-4">
      <UButton v-for="item in navigation" :key="item.name" :to="item.to" color="neutral" variant="ghost"
        class="w-full justify-start" :class="[
          route.path === item.to
            ? 'bg-primary-50 text-primary-700'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900',
        ]">
        <UIcon :name="item.icon" class="h-5 w-5" />
        {{ item.name }}
        <UBadge v-if="item.badge" size="xs" color="primary" class="ml-auto">
          {{ item.badge }}
        </UBadge>
      </UButton>
    </nav>

    <!-- User Profile -->
    <div class="border-t border-gray-200 p-4">
      <div class="flex items-center gap-3">
        <ClientOnly>
          <UAvatar :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.name || 'Admin'}`"
            :alt="admin?.name || 'Admin'" />
        </ClientOnly>
        <div class="flex-1">
          <ClientOnly>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ admin?.name || 'Admin User' }}</p>
              <p class="text-xs text-gray-500">{{ admin?.email || 'admin@example.com' }}</p>
            </div>
          </ClientOnly>
        </div>
        <UDropdownMenu :items="userMenuItems">
          <UButton icon="i-lucide-menu" color="neutral" variant="outline" :loading="loading" :disabled="loading" />
        </UDropdownMenu>
      </div>
    </div>
  </aside>
</template>
