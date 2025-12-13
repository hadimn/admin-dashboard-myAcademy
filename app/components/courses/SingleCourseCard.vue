<template>
  <div class="max-w-3xl mx-auto p-4 rounded-xl shadow-md bg-white flex flex-col sm:flex-row gap-4">
    <!-- Image on Left -->
    <div v-if="course.image_url" class="shrink-0 w-full sm:w-48 sm:h-50 object-fill">
      <img
        :src="course.image_url"
        alt="Course Image"
        class="w-full h-full object-cover rounded-xl shadow-sm"
      />
    </div>

    <!-- Info on Right -->
    <div class="flex-1 flex flex-col justify-between gap-3">
      <!-- Content -->
      <div class="flex flex-col gap-3">
        <!-- Header Row -->
        <div>
          <h1 class="text-2xl font-bold text-gray-900">{{ course.title }}</h1>
          <div class="flex flex-wrap items-center gap-2 text-sm text-gray-700 mt-1">
            <span
              class="px-2 py-0.5 rounded-full text-white text-xs font-semibold"
              :class="languageColors[course.language] || 'bg-gray-600'"
            >
              {{ course.language.toUpperCase() }}
            </span>
            <span><strong>ID:</strong> {{ course.course_id }}</span>
            <span><strong>Created:</strong> {{ new Date(course.created_at).toLocaleDateString() }}</span>
          </div>
        </div>

        <!-- Description -->
        <div>
          <h2 class="text-base font-semibold text-gray-800 mb-1">Description</h2>
          <div class="prose text-gray-700">
            <p>{{ course.description }}</p>
          </div>
        </div>

        <!-- Video -->
        <div v-if="course.video_url">
          <a
            :href="course.video_url"
            target="_blank"
            class="inline-block text-primary font-medium underline hover:text-primary/80 text-sm"
          >
            📹 Watch Video
          </a>
        </div>

        <!-- Extra Info Grid -->
        <div class="grid grid-cols-2 gap-2 mt-2">
          <div class="bg-gray-50 p-2 rounded-lg shadow-sm text-sm">
            <span class="block font-semibold text-gray-600">Language</span>
            <span class="text-gray-900 font-medium">{{ course.language.toUpperCase() }}</span>
          </div>

          <div class="bg-gray-50 p-2 rounded-lg shadow-sm text-sm">
            <span class="block font-semibold text-gray-600">Display Order</span>
            <span class="text-gray-900 font-medium">{{ course.order }}</span>
          </div>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="mt-4 flex flex-col sm:flex-row gap-2 sm:justify-end">
        <UButton variant="soft" size="sm">
          <NuxtLink to="/courses">← Back</NuxtLink>
        </UButton>

        <UButton variant="solid" color="primary" size="sm">
          <NuxtLink :to="`/courses/${course.course_id}/edit`">Edit</NuxtLink>
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  course: {
    type: Object,
    required: true,
  },
});

// Language Color Map
const languageColors: Record<string, string> = {
  en: "bg-blue-600",
  fr: "bg-purple-600",
  ar: "bg-teal-600",
  es: "bg-yellow-600",
};
</script>
