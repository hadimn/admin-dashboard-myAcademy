<script setup lang="ts">
import type { Admin } from '~/composables/useAdminAuth'

const route = useRoute();

const navigation = [
  { name: "Dashboard", to: "/", icon: "i-heroicons-home" },
  { name: "Leaderboard", to: "/leaderboards", icon: "i-heroicons-trophy" },
  { name: "admins" , to: "/admins", icon: "i-ic-outline-admin-panel-settings", key: 'admins'},
  { name: "Users", to: "/users", icon: "i-heroicons-users", key: 'users' },
  { name: "User Progress", to: "/userProgress", icon: "i-hugeicons-progress", key: 'user_progress' },
  { name: "courses", to: "/courses", icon: "i-heroicons-academic-cap", key: 'courses' },
  { name: "Course Pricing", to: "/coursePricing", icon: "i-heroicons-currency-dollar", key: 'course_pricing' },
  { name: "sections", to: "/sections", icon: "i-heroicons-squares-2x2", key: 'sections' },
  { name: "units", to: "/units", icon: "i-heroicons-cube", key: 'units' },
  { name: "lessons", to: "/lessons", icon: "i-heroicons-book-open", key: 'lessons' },
  { name: "questions", to: "/questions", icon: "i-healthicons-i-exam-multiple-choice-outline", key: 'questions' },
  { name: "answeredQuestions", to: "/answeredQuestions", icon: "i-heroicons-chat-bubble-left-right", key: 'answered_questions' },
  { name: "badges", to: "/badges", icon: "i-simple-line-icons-badge", key: 'badges' },
  { name: "userBadges", to: "/userBadges", icon: "i-iconoir-user-badge-check", key: 'user_badges'},
  { name: "enrollments", to: "/enrollments", icon: "i-streamline-give-gift", key: 'enrollments' },
  { name: "Analytics", to: "/analytics", icon: "i-heroicons-chart-bar" },
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
      onSelect: async () => {
        try {
          await navigateTo("/admin/profile");
        } catch (error) {
          console.error("Navigation to settings failed:", error);
        }
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

watch(
  () => route.fullPath,
  () => {
    emit('close')
  }
)

const { counts, fetchCounts, loading: countsLoading } = useDashboardCounts()

onMounted(() => {
  fetchCounts()
})


</script>

<template>
  <!-- Overlay for mobile -->
  <div v-show="props.isOpen" class="fixed inset-0 z-40 bg-inverted/50 lg:hidden" @click="emit('close')" />

  <aside
    class="fixed inset-y-0 left-0 z-50 w-72 flex flex-col border-r border-default bg-elevated transition-transform duration-200 lg:translate-x-0"
    :class="[
      'lg:translate-x-0',
      'transform',
      props.isOpen ? 'translate-x-0' : '-translate-x-full',
    ]">

    <!-- Logo -->
    <div class="flex h-16 items-center border-b border-default px-6 bg-accented">
      <!-- Close button for mobile -->
      <UButton icon="i-heroicons-x-mark" color="neutral" variant="ghost" class="lg:hidden" @click="emit('close')" />

      <div class="flex items-center gap-3">
        <UIcon name="i-heroicons-chart-bar" class="h-8 w-8 text-primary" />
        <span class="text-xl font-bold text-highlighted">
          <h1>{{ $t("logoName") }}</h1>
        </span>
      </div>
    </div>

    <!-- Navigation -->
    <nav class="flex-1 overflow-y-auto overflow-x-hidden space-y-1 p-4">
      <UButton v-for="item in navigation" :key="item.name" :to="item.to" color="neutral" variant="ghost"
        class="w-full justify-start" :class="[
          route.path === item.to
            ? 'bg-primary/10 text-primary'
            : 'text-default hover:bg-muted hover:text-highlighted',
        ]">
        <UIcon :name="item.icon" class="h-5 w-5" />
        {{ item.name }}
        <UBadge v-if="item.key && counts[item.key] !== undefined" size="xs" color="primary" class="ml-auto">
          {{ counts[item.key] }}
        </UBadge>
      </UButton>
    </nav>

    <!-- User Profile -->
    <div class="border-t border-default p-4 bg-accented">
      <div class="flex items-center gap-3">
        <ClientOnly>
          <UAvatar :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.name || 'Admin'}`"
            :alt="admin?.name || 'Admin'" />
        </ClientOnly>
        <div class="flex-1">
          <ClientOnly>
            <div>
              <p class="text-sm font-medium text-highlighted">{{ admin?.name || 'Admin User' }}</p>
              <p class="text-xs text-muted">{{ admin?.email || 'admin@example.com' }}</p>
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
