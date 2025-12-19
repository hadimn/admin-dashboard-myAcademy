<script setup lang="ts">
interface Props {
  fieldCount?: number;
  showHeader?: boolean;
  showFooter?: boolean;
}

withDefaults(defineProps<Props>(), {
  fieldCount: 6,
  showHeader: true,
  showFooter: true
});
</script>

<template>
  <div>
    <!-- Header Skeleton -->
    <div v-if="showHeader" class="flex justify-between items-center mb-6">
      <USkeleton class="h-6 w-40" />
      <USkeleton class="h-9 w-16" />
    </div>

    <!-- Detail Fields Skeleton -->
    <dl class="divide-y divide-gray-200 dark:divide-gray-700">
      <div 
        v-for="i in fieldCount" 
        :key="`skeleton-detail-${i}`" 
        class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"
      >
        <!-- Label -->
        <dt>
          <USkeleton class="h-4 w-24" />
        </dt>
        <!-- Value -->
        <dd class="mt-1 sm:col-span-2 sm:mt-0">
          <USkeleton class="h-4 w-full max-w-md" />
        </dd>
      </div>
    </dl>

    <!-- Footer Skeleton -->
    <div v-if="showFooter" class="flex justify-start mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <USkeleton class="h-9 w-32" />
    </div>
  </div>
</template>
