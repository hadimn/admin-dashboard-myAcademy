<script setup lang="ts">
import SingleCourseCard from "~/components/courses/SingleCourseCard.vue";

const route = useRoute();

const courseId = route.params.id;

definePageMeta({
  validate(route) {
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});

// Scanned composable from nuxt.config.ts "useCoursesShowCourse()" method
const { course, pending, error, refetch } = useShowCourse(courseId);

watch(
  () => route.fullPath,
  async () => {
    await refetch();
  }
);
</script>
<template>
  <div :key="route.fullPath">
    <div v-if="course?.data">
      <SingleCourseCard :course="course?.data" />
    </div>

    <div v-if="pending">
      <UProgress :v-model="pending" />
    </div>

    <div v-if="error" class="bg-error-50">
      {{ error.message }}
      <div v-if="!course?.data">
        <UAlert icon="i-heroicons-exclamation-triangle" color="warning" variant="soft" title="Warning!"
          :description="`course with id ${courseId} is missing!`" />
      </div>
    </div>
  </div>
</template>


<style scoped></style>
