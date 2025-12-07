<script setup lang="ts">
import CourseCard from "~/components/CourseCard.vue";

const { courses, pending, error, refetch } = useCourses();

</script>

<template>
  <div class="p-6 space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h2 class="text-2xl font-bold">All Courses</h2>

      <UButton color="primary" @click="refetch" :loading="pending">
        Refresh
      </UButton>
    </div>

    <!-- Loading -->
    <div v-if="pending" class="flex justify-center py-10">
      <ULoading size="lg" />
    </div>

    <!-- Error -->
    <div v-if="error" class="text-red-500 bg-red-100 p-4 rounded-md">
      {{ error }}
    </div>

    <!-- Courses Grid -->
    <div
      v-if="courses?.data"
      class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      <CourseCard
        v-for="course in courses.data"
        :key="course.course_id"
        :course="course"
      />
    </div>

    <!-- No Courses -->
    <p v-if="courses?.data?.length === 0" class="text-center text-gray-500">
      No courses available.
    </p>
  </div>
</template>
