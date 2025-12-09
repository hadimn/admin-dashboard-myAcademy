<template>
  <div class="max-w-3xl mx-auto p-6 border-y-indigo-200 rounded-lg shadow-md">
    <!-- Back button -->
    <div class="mb-1 flex justify-between">
      <UButton variant="soft">
        <NuxtLink to="/courses">Back to Courses</NuxtLink>
      </UButton>

      <UButton variant="solid" color="primary">
        <NuxtLink :to="`/courses/${course.course_id}/edit`">Edit</NuxtLink>
      </UButton>
    </div>
    <!-- Title -->
    <h1 class="text-3xl font-bold mb-4">{{ course.title }}</h1>

    <!-- Language Badge + Info Row -->
    <div class="flex items-center flex-wrap gap-4 text-sm text-gray-700 mb-4">
      <span class="px-3 py-1 rounded text-white text-xs font-semibold"
        :class="languageColors[course.language] || 'bg-gray-600'">
        {{ course.language }}
      </span>

      <span><strong>ID:</strong> {{ course.course_id }}</span>

      <span>
        <strong>Created:</strong>
        {{ new Date(course.created_at).toLocaleDateString() }}
      </span>
    </div>

    <!-- Image -->
    <div v-if="course.image_url" class="mb-5 flex justify-center items-center">
      <img :src="course.image_url" alt="Course Image" class="w-fit object-cover rounded-lg shadow-sm" />
    </div>

    <!-- Description -->
    <div class="prose text-gray-800 mb-6">
      <p>{{ course.description }}</p>
    </div>

    <!-- Video Link -->
    <div v-if="course.video_url" class="mb-6">
      <a :href="course.video_url" target="_blank" class="text-blue-600 underline text-lg hover:text-blue-800">
        📹 Watch Course Video
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig();

const domainURL = config.public.domainUrl;

defineProps({
  course: {
    type: Object,
    required: true,
  },
});

// 🎨 Language Color Map
const languageColors: Record<string, string> = {
  en: "bg-blue-600",
  fr: "bg-purple-600",
  ar: "bg-teal-600",
  es: "bg-yellow-600",
};
</script>
