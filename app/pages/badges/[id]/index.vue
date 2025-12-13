<script setup lang="ts">
import type SingleBadgeCardVue from "~/components/badges/SingleBadgeCard.vue";
import SingleCourseCard from "~/components/courses/SingleCourseCard.vue";

const route = useRoute();

const badgeId = route.params.id;

definePageMeta({
  validate(route) {
    return typeof route.params.id === "string" && /^\d+$/.test(route.params.id);
  },
});

// Scanned composable from nuxt.config.ts "useCoursesShowCourse()" method
const { badge, pending, error, refetch } = useShowBadge(badgeId);

onMounted(() => {
  refetch();
})
</script>

<template>
  <div>
    <!-- pending -->
    <div v-if="pending">
      <UProgress :v-model="pending" />
    </div>
    <!-- success -->
    <div v-if="badge?.data">
      <BadgesSingleBadgeCard :badge="badge?.data" />
    </div>
    <!-- error -->
    <div v-if="error" class="bg-error-50">
      {{ error.message }}
      <div v-if="!badge?.data">
        <UAlert icon="i-heroicons-exclamation-triangle" color="warning" variant="soft" title="Warning!"
          :description="`course with id ${badgeId} is missing!`" :close-button="{
            icon: 'i-heroicons-x-mark-20-solid',
            color: 'orange',
            variant: 'link',
          }" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
