<!-- app/components/CrudTable.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { ResourceConfig } from '~/types/crud'

interface Props {
  config: ResourceConfig<T>
  items: T[]
  loading: boolean
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [id: string | number]
  edit: [id: string | number]
  deleteItem: [item: T]
  pageChange: [page: number]
}>()

// Get fields that should show in table
const tableFields = computed(() =>
  props.config.fields.filter(f => f.showInTable !== false)
)

// Render cell value
const renderCell = (item: T, field: any) => {
  const value = item[field.key];

  if (field.render) {
    return field.render(value, item);
  }

  if (value === null || value === undefined) {
    return '-';
  }

  // Detect image (simple check for URL ending with image extension)
  if (typeof value === 'string' && /\.(jpg|jpeg|png|gif|webp|avif)$/i.test(value)) {
    return `<img src="${value}" alt="${field.label}" class="w-10 h-10 rounded-full object-cover" />`;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return String(value);
};


const getItemId = (item: T) => {
  return item[props.config.idField || 'id']
}
</script>

<template>
  <div class="space-y-4">
    <UCard>
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-800">
            <tr>
              <th v-for="field in tableFields" :key="field.key"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                {{ field.label }}
              </th>
              <th
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-if="loading">
              <td :colspan="tableFields.length + 1" class="px-6 py-4 text-center">
                <UIcon name="i-heroicons-arrow-path" class="animate-spin" />
                Loading...
              </td>
            </tr>
            <tr v-else-if="items.length === 0">
              <td :colspan="tableFields.length + 1" class="px-6 py-4 text-center text-gray-500">
                No {{ config.name }} found
              </td>
            </tr>
            <tr v-else v-for="item in items" :key="getItemId(item)"
              class="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              <td v-for="field in tableFields" :key="field.key"
                class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                v-html="renderCell(item, field)">
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                <UButton icon="i-heroicons-eye" size="xs" color="neutral" variant="ghost"
                  @click="emit('view', getItemId(item))" title="View" />
                <UButton icon="i-heroicons-pencil-square" size="xs" color="primary" variant="ghost"
                  @click="emit('edit', getItemId(item))" title="Edit" />
                <UButton icon="i-heroicons-trash" size="xs" color="error" variant="ghost"
                  @click="emit('deleteItem', item)" title="Delete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Pagination -->
    <div v-if="pagination.last_page > 1" class="flex justify-between items-center">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }}
        to {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
        of {{ pagination.total }} results
      </div>
      <UPagination v-model="pagination.current_page" :page-count="pagination.per_page" :total="pagination.total"
        @update:model-value="emit('pageChange', $event)" />
    </div>
  </div>
</template>