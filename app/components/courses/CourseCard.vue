<template>
  <div
    class="flex items-center justify-between p-4 rounded-lg border bg-white shadow-sm hover:shadow-md transition"
  >
    <!-- Left section: Image + Title + Info -->
    <div class="flex items-center space-x-4">
      <!-- Image -->
      <img
        v-if="course.image_url"
        :src="course.image_url"
        class="w-20 h-20 object-cover rounded-md"
      />

      <!-- Text Content -->
      <div>
        <h3 class="text-lg font-semibold">{{ course.title }}</h3>

        <div class="flex items-center space-x-3 text-sm text-gray-600 mt-1">
          <span><strong>ID:</strong> {{ course.course_id }}</span>

          <!-- Language Badge -->
          <span
            class="px-2 py-1 rounded text-white text-xs font-medium"
            :class="languageColors[course.language] || 'bg-gray-500'"
          >
            {{ course.language }}
          </span>

          <span>
            <strong>Created:</strong>
            {{ new Date(course.created_at).toLocaleDateString() }}
          </span>
        </div>

        <!-- Video link -->
        <div v-if="course.video_url" class="mt-1">
          <a
            :href="course.video_url"
            target="_blank"
            class="text-blue-600 underline text-sm"
          >
            Watch Video
          </a>
        </div>
      </div>
    </div>

    <!-- Right section: Button -->
    <UButton variant="soft">
      <NuxtLink :to="`/courses/${course.course_id}`">View</NuxtLink>
    </UButton>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  course: {
    type: Object,
    required: true,
  },
});

// 🎨 Language → Color map
const languageColors: Record<string, string> = {
  en: "bg-blue-600",
  fr: "bg-purple-600",
  ar: "bg-teal-600",
  es: "bg-yellow-600"
};
</script>
