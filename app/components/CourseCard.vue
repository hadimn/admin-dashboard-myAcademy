<template>
  <UCard class="shadow-lg hover:shadow-xl transition">
    <template #header>
      <h3 class="text-xl font-semibold">{{ course.title }}</h3>
    </template>

    <div class="space-y-3">
      <p class="text-gray-700">
        {{ course.description }}
      </p>

      <div class="text-sm text-gray-500">
        <p><strong>Language:</strong> {{ course.language }}</p>
        <p><strong>Course ID:</strong> {{ course.course_id }}</p>
        <p>
          <strong>Created:</strong>
          {{ new Date(course.created_at).toLocaleDateString() }}
        </p>
      </div>

      <div v-if="course.image_url">
        <img :src="course.image_url" alt="" class="rounded-md w-full h-40 object-cover" />
      </div>

      <div v-if="course.video_url" class="pt-2">
        <a :href="course.video_url" target="_blank" class="text-blue-600 underline">
          Watch Course Video
        </a>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end">
        <UButton variant="soft">
          <NuxtLink :to="`/courses/${course.course_id}`">
            View Details
          </NuxtLink>
        </UButton>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
defineProps({
  course: {
    type: Object,
    required: true,
  },
});
</script>
