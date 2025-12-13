<template>
  <div class="max-w-3xl mx-auto p-4 rounded-xl shadow-md bg-white flex flex-col sm:flex-row gap-4">
    <!-- Icon on Left -->
    <div v-if="badge.icon" class="shrink-0 w-24 h-24 flex items-center justify-center bg-gray-100 rounded-xl shadow-sm">
      <img v-if="isImage(badge.icon)" :src="badge.icon" alt="Badge Icon" class="w-16 h-16 object-cover rounded-lg" />
      <span v-else class="text-3xl">{{ badge.icon }}</span>
    </div>

    <!-- Info on Right -->
    <div class="flex-1 flex flex-col justify-between gap-3">
      <!-- Header -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">{{ badge.name }}</h1>
        <div class="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-1">
          <span class="px-2 py-0.5 rounded-full text-white text-xs font-semibold bg-gray-600">
            {{ badge.type.toUpperCase() }}
          </span>
          <span><strong>ID:</strong> {{ badge.badge_id }}</span>
          <span><strong>Points:</strong> {{ badge.points }}</span>
        </div>
      </div>

      <!-- Description -->
      <div>
        <h2 class="text-base font-semibold text-gray-800 mb-1">Description</h2>
        <div class="prose text-gray-700">
          <p>{{ badge.description }}</p>
        </div>
      </div>

      <!-- Criteria -->
      <div v-if="badge.criteria">
        <h3 class="text-sm font-semibold text-gray-600">Criteria:</h3>
        <ul class="list-disc list-inside text-gray-700 text-sm">
          <li v-for="(value, key) in badge.criteria" :key="key">
            {{ formatCriteria(String(key), value) }}
          </li>
        </ul>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <UButton variant="soft" size="sm">
          <NuxtLink to="/badges">← Back</NuxtLink>
        </UButton>
        <UButton variant="solid" color="primary" size="sm">
          <NuxtLink :to="`/badges/${badge.badge_id}/edit`">Edit</NuxtLink>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  badge: {
    type: Object,
    required: true,
  },
});

// Helper: check if icon is an image URL
const isImage = (icon: string) => {
  return icon.startsWith("http") || icon.startsWith("/storage/");
};

// Helper: format criteria nicely
const formatCriteria = (key: string, value: any) => {
  const map: Record<string, string> = {
    days_required: "Days Required",
    courses_required: "Courses Required",
    lessons_required: "Lessons Required",
    points_required: "Points Required",
    minutes_required: "Minutes Required",
  };
  return `${map[key] || key}: ${value}`;
};
</script>
