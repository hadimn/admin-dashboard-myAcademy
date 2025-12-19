<script setup lang="ts">
import type { ResourceField } from '~/types/crud';

interface Props {
  columns: ResourceField[];
  rows: number;
}

defineProps<Props>();
</script>

<template>
  <tr v-for="i in rows" :key="`skeleton-${i}`">
    <td v-for="field in columns" :key="`skeleton-cell-${field.key}`" class="px-6 py-4">
      <USkeleton class="h-6 w-full" />
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex justify-end space-x-2">
        <USkeleton class="h-8 w-8 rounded-md" />
        <USkeleton class="h-8 w-8 rounded-md" />
        <USkeleton class="h-8 w-8 rounded-md" />
      </div>
    </td>
  </tr>
</template>
