<template>
  <header
    class="sticky top-0 z-40 flex h-16 items-center gap-2 sm:gap-4 border-b border-default bg-elevated px-4 sm:px-6 lg:px-8">
    <!-- Sidebar Toggle -->
    <UButton icon="i-heroicons-bars-3" color="neutral" variant="ghost" class="lg:hidden"
      @click="$emit('toggleSidebar')" />

    <!-- Search Trigger - Desktop (Full Button) -->
    <div class="flex-1 hidden md:block">
      <UButton @click="isSearchOpen = true" color="neutral" variant="outline" block class="justify-start">
        <template #leading>
          <UIcon name="i-heroicons-magnifying-glass" />
        </template>
        <span class="text-muted">Search pages...</span>
        <template #trailing>
          <UKbd value="/" class="hidden lg:inline-flex" />
        </template>
      </UButton>
    </div>

    <!-- Search Trigger - Mobile (Icon Only) -->
    <UButton @click="isSearchOpen = true" icon="i-heroicons-magnifying-glass" color="neutral" variant="ghost" size="md"
      class="md:hidden" aria-label="Search" />

    <!-- Spacer for mobile to push items to right -->
    <div class="flex-1 md:hidden"></div>

    <!-- Search Modal -->
    <UModal v-model:open="isSearchOpen">
      <template #content>
        <UCommandPalette v-model="selectedPage" v-model:search-term="searchTerm" :groups="searchGroups"
          placeholder="Search pages..." :class="['transition-all', isMobile ? 'h-[70vh]' : 'h-80']" close
          @update:model-value="handlePageSelect" @update:open="isSearchOpen = $event" />
      </template>
    </UModal>

    <!-- Notifications & Actions -->
    <div class="flex items-center gap-1 sm:gap-2">
      <ButtonsColorModeButton />

      <!-- Notification Bell - Show on all screens -->
      <UButton icon="i-heroicons-bell" color="neutral" variant="ghost" :badge="3" />

      <UDropdownMenu :items="notificationItems">
        <UButton icon="i-heroicons-ellipsis-vertical" color="neutral" variant="ghost" />
        <!-- Custom slot for language selector -->
        <template #language>
          <div class="w-full">
            <p class="mb-1 text-xs font-medium text-muted">
              Language
            </p>
            <USelect class="w-full" v-model="currentLocale" :items="localeItems" option-attribute="label" size="sm" />
          </div>
        </template>
      </UDropdownMenu>
    </div>
  </header>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref, computed } from "vue";

const router = useRouter();
const { locale, locales, setLocale } = useI18n();

const currentLocale = ref(locale.value);
const isSearchOpen = ref(false);
const searchTerm = ref("");
const selectedPage = ref(null);

// Detect mobile
const isMobile = ref(false);

// Define your pages/routes for search
const pages = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: 'i-heroicons-home',
    to: '/',
    description: 'Overview and statistics'
  },
  {
    id: 'profile',
    label: 'Profile',
    icon: 'i-heroicons-user',
    to: '/admin/profile',
    description: 'Manage your account settings'
  },
  {
    id: 'users',
    label: 'Users',
    icon: 'i-heroicons-users',
    to: '/users',
    description: 'Manage system users'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'i-heroicons-cog-6-tooth',
    to: '/settings',
    description: 'Application settings'
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: 'i-heroicons-document-text',
    to: '/reports',
    description: 'View and generate reports'
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'i-heroicons-chart-bar',
    to: '/analytics',
    description: 'Analytics and insights'
  },
  {
    id: 'courses',
    label: 'Courses',
    icon: 'i-heroicons-academic-cap',
    to: '/courses',
    description: 'Courses and insights'
  },
  {
    id: 'userprogress',
    label: 'User Progress',
    icon: 'i-hugeicons-progress',
    to: '/userProgress',
    description: 'User and their progress'
  },
  {
    id: 'units',
    label: 'Units',
    icon: 'i-heroicons-cube',
    to: '/units',
    description: 'units of each section',
  },
  {
    id: 'coursepricing',
    label: 'course pricing',
    icon: 'i-heroicons-currency-dollar',
    to: '/coursePricing',
    description: 'prices of courses',
  },
  {
    id: 'sections',
    label: 'sections',
    icon: 'i-heroicons-squares-2x2',
    to: '/sections',
    description: 'sections of each course',
  },
  {
    id: 'lessons',
    label: 'Lessons',
    icon: 'i-heroicons-book-open',
    to: '/lessons',
    description: 'lessons of each unit',
  },
  {
    id: 'questions',
    label: 'Questions',
    icon: 'i-healthicons-i-exam-multiple-choice-outline',
    to: '/questions',
    description: 'questions of each lesson',
  },
  {
    id: 'answeredQuestions',
    label: 'Answered Questions',
    icon: 'i-heroicons-chat-bubble-left-right',
    to: '/answeredQuestions',
    description: 'answered questions of each lesson',
  },
  {
    id: 'badges',
    label: 'Badges',
    icon: 'i-simple-line-icons-badge',
    to: '/badges',
    description: 'Badges users can earn',
  },
  {
    id: 'enrollments',
    label: 'Enrollments',
    icon: 'i-heroicons-user-group',
    to: '/enrollments',
    description: 'User enrollments in courses',
  },
  {
    id: 'admins',
    label: 'Admins',
    icon: 'i-ic-outline-admin-panel-settings',
    to: '/admins',
    description: 'Admins and their permissions',
  },
  {
    id: 'leaderboard',
    label: 'Leaderboard',
    icon: 'i-heroicons-trophy',
    to: '/leaderboards',
    description: 'User points leaderboard'
  },
  {
    id: 'userbadges',
    label: 'User Badges',
    icon: 'i-iconoir-user-badge-check',
    to: '/userBadges',
    description: 'User badges and their progress',
  },
  
  // Add more pages as needed
];

// Transform locales to USelect items format
const localeItems = computed(() =>
  locales.value.map((lang) => ({
    label: lang.name,
    value: lang.code,
    icon: lang.code === 'en' ? 'i-circle-flags-us' : 'i-circle-flags-sa',
  }))
);

// Create search groups
const searchGroups = computed(() => [
  {
    id: 'pages',
    label: 'Pages',
    items: pages.map(page => ({
      ...page,
      suffix: page.description,
      onSelect: () => {
        router.push(page.to);
        isSearchOpen.value = false;
        searchTerm.value = '';
      }
    }))
  }
]);

// Handle locale change
watch(currentLocale, (newLocale) => {
  console.log("Locale changed to:", newLocale);
  setLocale(newLocale);
});

// Handle page selection
function handlePageSelect(item: any) {
  if (item?.to) {
    router.push(item.to);
    isSearchOpen.value = false;
    searchTerm.value = '';
  }
}

defineEmits<{
  toggleSidebar: [];
}>();

const notificationItems = [
  [
    {
      label: "language",
      icon: "i-heroicons-language",
      slot: "language",
    }
  ],
  [
    {
      label: "View all notifications",
      icon: "i-heroicons-bell",
    },
  ],
  [
    {
      label: "Mark all as read",
      icon: "i-heroicons-check",
    },
  ],
];

// Check if mobile
const checkMobile = () => {
  isMobile.value = window.innerWidth < 768;
};

// Keyboard shortcuts
const handleKeydown = (e: KeyboardEvent) => {
  const isMac = navigator.platform.toUpperCase().includes("MAC");

  // Ctrl + K or Cmd + K to open search
  if ((isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    isSearchOpen.value = true;
  }

  // "/" shortcut to open search
  if (
    e.key === "/" &&
    document.activeElement?.tagName !== "INPUT" &&
    document.activeElement?.tagName !== "TEXTAREA"
  ) {
    e.preventDefault();
    isSearchOpen.value = true;
  }

  // ESC to close search
  if (e.key === "Escape" && isSearchOpen.value) {
    isSearchOpen.value = false;
    searchTerm.value = '';
  }
};

onMounted(() => {
  checkMobile();
  window.addEventListener("keydown", handleKeydown);
  window.addEventListener("resize", checkMobile);
});

onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleKeydown);
  window.removeEventListener("resize", checkMobile);
});
</script>
