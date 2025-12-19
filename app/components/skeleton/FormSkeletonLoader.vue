<script setup lang="ts">
interface Props {
  fieldCount?: number;
  columns?: 1 | 2;
  showHeader?: boolean;
  showActions?: boolean;
}

withDefaults(defineProps<Props>(), {
  fieldCount: 6,
  columns: 2,
  showHeader: true,
  showActions: true
});
</script>

<template>
  <div>
    <!-- Header Skeleton -->
    <div v-if="showHeader" class="mb-6">
      <USkeleton class="h-6 w-32" />
    </div>

    <!-- Form Fields Skeleton -->
    <div 
      class="space-y-4 grid gap-6"
      :class="{
        'grid-cols-1': columns === 1,
        'grid-cols-1 md:grid-cols-2': columns === 2
      }"
    >
      <div 
        v-for="i in fieldCount" 
        :key="`skeleton-field-${i}`" 
        class="col-span-1"
      >
        <div class="space-y-2">
          <!-- Label -->
          <USkeleton class="h-4 w-24" />
          <!-- Input -->
          <USkeleton class="h-10 w-full" />
        </div>
      </div>

      <!-- Action Buttons Skeleton -->
      <div 
        v-if="showActions"
        class="flex justify-end gap-3 pt-4 w-full"
        :class="{
          'col-span-1': columns === 1,
          'col-span-1 md:col-span-2': columns === 2
        }"
      >
        <USkeleton class="h-10 w-20" />
        <USkeleton class="h-10 w-24" />
      </div>
    </div>
  </div>
</template>
