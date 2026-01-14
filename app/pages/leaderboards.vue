<script setup lang="ts">
import { ref, onMounted, computed, watch } from "vue";
import type { LeaderboardUser } from "~/types/leaderboard";

const { fetchTopUsers, fetchAllUsers, loading, error } = useLeaderboard();

// State
const topUsers = ref<LeaderboardUser[]>([]);
const allUsers = ref<LeaderboardUser[]>([]);
const activeTab = ref<"top" | "all">("top");
const searchTerm = ref("");
const sortField = ref<keyof LeaderboardUser>("Rank");
const sortDirection = ref<"asc" | "desc">("asc");
const currentPage = ref(1);

// Fetch data on component mount
onMounted(async () => {
  await Promise.all([loadTopUsers(), loadAllUsers()]);
});

const loadTopUsers = async () => {
  try {
    topUsers.value = await fetchTopUsers();
  } catch (err) {
    console.error("Failed to load top users:", err);
  }
};

const loadAllUsers = async () => {
  try {
    allUsers.value = await fetchAllUsers();
  } catch (err) {
    console.error("Failed to load all users:", err);
  }
};

// Computed properties for filtered and sorted data
const filteredUsers = computed(() => {
  const users = activeTab.value === "top" ? topUsers.value : allUsers.value;

  if (!searchTerm.value) return users;

  return users.filter(
    (user) =>
      user.username?.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      user.user_id.toString().includes(searchTerm.value)
  );
});

// Paginated users for 'all' tab
const paginatedUsers = computed(() => {
  if (activeTab.value === "top") return sortedUsers.value;
  const start = (currentPage.value - 1) * 10;
  return sortedUsers.value.slice(start, start + 10);
});

const sortedUsers = computed(() => {
  return [...filteredUsers.value].sort((a, b) => {
    let aVal = a[sortField.value];
    let bVal = b[sortField.value];

    // Handle numeric sorting
    if (
      sortField.value === "Rank" ||
      sortField.value === "total_points" ||
      sortField.value === "user_id"
    ) {
      aVal = Number(aVal);
      bVal = Number(bVal);
    } else {
      // String sorting
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
    }

    if (sortDirection.value === "asc") {
      return aVal > bVal ? 1 : -1;
    } else {
      return aVal < bVal ? 1 : -1;
    }
  });
});

// Sorting handler
const handleSort = (field: keyof LeaderboardUser) => {
  if (sortField.value === field) {
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    sortField.value = field;
    sortDirection.value = "asc";
  }
};

// Refresh data
const refreshData = async () => {
  if (activeTab.value === "top") {
    await loadTopUsers();
  } else {
    await loadAllUsers();
  }
};

// Download as CSV
const downloadCSV = () => {
  const headers = ["Rank", "User ID", "Username", "Total Points"];
  const data = sortedUsers.value.map((user) => [
    user.Rank,
    user.user_id,
    user.username,
    user.total_points,
  ]);

  const csvContent = [
    headers.join(","),
    ...data.map((row) => row.join(",")),
  ].join("\n");

  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `leaderboard_${activeTab.value}_${new Date().toISOString().split("T")[0]
    }.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};
</script>

<template>
  <div class="space-y-6">
    <SkeletonLeaderboardSkeleton v-if="loading" />
    <div v-else>
      <!-- Page Header -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
            Leaderboard
          </h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1 mb-2">
            Track user performance based on earned points
          </p>
        </div>
        <div class="flex items-center gap-2 mb-2 md:mb-0">
          <UButton icon="i-heroicons-document-arrow-down" variant="outline" @click="downloadCSV" :disabled="loading">
            Export CSV
          </UButton>
          <UButton icon="i-heroicons-arrow-path" variant="ghost" :loading="loading" @click="refreshData"
            title="Refresh" />
        </div>
      </div>

      <!-- Error Alert -->
      <UAlert v-if="error" color="error" variant="solid" :title="error" icon="i-heroicons-exclamation-triangle"
        class="mb-4" />

      <!-- Tabs -->
      <!-- display leaderboards with two button all top users and top 10 users -->
      <div class="flex gap-2 mb-4">
        <UButton :variant="activeTab === 'top' ? 'solid' : 'outline'" @click="activeTab = 'top'">
          Top 10 Users
        </UButton>
        <UButton :variant="activeTab === 'all' ? 'solid' : 'outline'" @click="activeTab = 'all'">
          All Users
        </UButton>
      </div>

      <!-- Search and Stats -->
      <div class="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
        <UInput v-model="searchTerm" icon="i-heroicons-magnifying-glass" placeholder="Search users..."
          class="w-full md:w-auto" />
        <div class="flex flex-wrap gap-4">
          <UCard class="p-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Total Users
            </div>
            <div class="text-xl font-bold text-gray-900 dark:text-white">
              {{ allUsers.length }}
            </div>
          </UCard>
          <UCard class="p-3">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Top Scorer
            </div>
            <div class="text-xl font-bold text-gray-900 dark:text-white">
              {{ topUsers[0]?.username || "N/A" }}
            </div>
          </UCard>
        </div>
      </div>

      <!-- Leaderboard Table -->

      <UCard>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead class="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  @click="handleSort('Rank')">
                  Rank
                  <UIcon v-if="sortField === 'Rank'" :name="sortDirection === 'asc'
                      ? 'i-heroicons-arrow-up'
                      : 'i-heroicons-arrow-down'
                    " class="ml-1" />
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  @click="handleSort('username')">
                  Username
                  <UIcon v-if="sortField === 'username'" :name="sortDirection === 'asc'
                      ? 'i-heroicons-arrow-up'
                      : 'i-heroicons-arrow-down'
                    " class="ml-1" />
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  @click="handleSort('total_points')">
                  Total Points
                  <UIcon v-if="sortField === 'total_points'" :name="sortDirection === 'asc'
                      ? 'i-heroicons-arrow-up'
                      : 'i-heroicons-arrow-down'
                    " class="ml-1" />
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
                  @click="handleSort('user_id')">
                  User ID
                  <UIcon v-if="sortField === 'user_id'" :name="sortDirection === 'asc'
                      ? 'i-heroicons-arrow-up'
                      : 'i-heroicons-arrow-down'
                    " class="ml-1" />
                </th>
              </tr>
            </thead>
            <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              <tr v-if="paginatedUsers.length === 0">
                <td colspan="4" class="px-6 py-4 text-center text-gray-500">
                  No users found.
                </td>
              </tr>
              <tr v-for="(user, index) in paginatedUsers" :key="user.user_id"
                class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                  {{ user.Rank }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  <div class="flex items-center gap-3">
                    <UAvatar :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`"
                      :alt="user.username" size="sm" />
                    <span>{{ user.username }}</span>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ user.total_points }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                  {{ user.user_id }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <!-- Pagination for All Users tab -->
        <div v-if="activeTab === 'all' && filteredUsers.length > 10" class="flex justify-center px-4 py-3 sm:px-6">
          <UPagination v-model="currentPage" :page-count="10" :total="filteredUsers.length" />
        </div>
      </UCard>
    </div>
  </div>
</template>

<style scoped>
/* Custom scrollbar */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

.dark ::-webkit-scrollbar-track {
  background: #374151;
}

.dark ::-webkit-scrollbar-thumb {
  background: #6b7280;
}

.dark ::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
