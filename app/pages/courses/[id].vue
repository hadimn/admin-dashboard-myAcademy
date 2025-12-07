<script setup lang="ts">
import CourseCard from "~/components/CourseCard.vue";

const route = useRoute();

const courseId = route.params.id;

definePageMeta({
  validate(route) {
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});

// Scanned composable from nuxt.config.ts "useCoursesShowCourse()" method
const { course, pending, error, refetch } = useCoursesShowCourse(courseId);
</script>

<template>
  <div class="p-6 space-y-6">
    <div class="flex items-center justify-between">
      <!-- pending -->
      <div v-if="pending">
        <Uloading size="lg" />
      </div>
      <!-- error -->
      <div v-if="error" class="bg-error-50">
        {{ error.message }}
      </div>
      <!-- success -->
      <div
        v-if="course?.data"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <CourseCard :course="course?.data" , />
      </div>

      <div v-if="!course?.data">
        <UAlert
          icon="i-heroicons-exclamation-triangle"
          color="warning"
          variant="soft"
          title="Warning!"
          :description="`course with id ${courseId} is missing!`"
          :close-button="{
            icon: 'i-heroicons-x-mark-20-solid',
            color: 'orange',
            variant: 'link',
          }"
        />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
