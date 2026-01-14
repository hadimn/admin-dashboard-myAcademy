<!-- app/components/CrudsCrudTable.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import SkeletonLoader from '~/components/skeleton/SkeletonLoader.vue';
import type { ResourceConfig } from '~/types/crud'

interface Props {
  config: ResourceConfig<T>
  items: T[]
  loading: boolean
  edit?: boolean
  pagination: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

const props = withDefaults(defineProps<Props>(), {
  edit: true,
});

const emit = defineEmits<{
  view: [id: string | number]
  edit: [id: string | number]
  deleteItem: [item: T]
  pageChange: [page: number]
}>()

const resourceMap: Record<string, ResourceConfig> = {
  courses: coursesResource,
  sections: sectionsResource,
  units: unitsResource,
  lessons: lessonsResource,
  questions: questionsResource,
  badges: badgesResource,
  users: usersResource,
};

// Local page state for the pagination component
const currentPage = computed({
  get: () => props.pagination.current_page,
  set: (value) => emit('pageChange', value)
})

// Get fields that should show in table
const tableFields = computed(() =>
  props.config.fields.filter(f => f.showInTable !== false)
)


const remoteOptions = ref<Record<string, { label: string; value: any }[]>>({});

// Fetch remote options for fields that require them without showing the id then showing the values one by one
const fetchRemoteOptions = async () => {
  for (const field of tableFields.value) {
    if (field.resource && resourceMap[field.resource]) {
      const config = resourceMap[field.resource];
      const { fetchItems, items } = useCrud(config as any);

      try {
        await fetchItems(1, "");
        remoteOptions.value[field.key] = items.value.map((item: any) => ({
          label: item[field.optionLabel || "title"],
          value: item[field.optionValue || "id"],
        }));
      } catch (e) {
        console.error(`Failed to fetch options for ${field.key}`, e);
      }
    }
  }
};



// Render cell value
const renderCell = (item: T, field: any) => {
  const value = item[field.key];

  if (field.render) {
    return field.render(value, item);
  }

  if (value === null || value === undefined) {
    // if file then return avatar with the 2 letters of label
    if (field.type == 'file') {
      return `<div class="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-xs font-medium">${field.label.substring(0, 2).toUpperCase()}</div>`;
    }
    return "-";
  }

  // return resource filed value instead of id
  if (field.resource) {
    const resourceConfig = resourceMap[field.resource];
    const relatedItem = remoteOptions.value[field.key]?.find(
      (option) => option.value === value
    );
    return relatedItem ? relatedItem.label : "-";
  }

  // Detect image (simple check for URL ending with image extension)
  if (typeof value === 'string' && field.type == 'file' && field.fileType == 'image') {
    return `<img src="${value}" alt="${field.label}" class="w-10 h-10 rounded-full object-cover" />`;
  }

  // Detect video (simple check for URL ending with image extension)
  if (typeof value === 'string' && field.type == 'file' && field.fileType == 'video') {
    return `<a href=${value}>watch video</a>`;
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  if (field.type === 'date' && value) {
    return new Date(value).toLocaleDateString();
  }

  if (field.type === 'datetime' && value) {
    return new Date(value).toLocaleString();
  }

  if (field.type == 'color' && value) {
    return `<div class="w-5 h-5 rounded-full" style="background-color: ${value}"></div>`;
  }


  return String(value);
};


const getItemId = (item: T) => {
  return item[props.config.idField || 'id']
}

onMounted(() => {
  fetchRemoteOptions();
});
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
            <SkeletonLoader v-if="loading" :columns="tableFields" :rows="pagination.per_page" />

            <tr v-else-if="!loading && items.length === 0">
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
                <UButton v-if="edit" icon="i-heroicons-pencil-square" size="xs" color="primary" variant="ghost"
                  @click="emit('edit', getItemId(item))" title="Edit" />
                <UButton icon="i-heroicons-trash" size="xs" color="error" variant="ghost"
                  @click="emit('deleteItem', item)" title="Delete" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </UCard>

    <!-- Pagination - FIXED -->
    <div v-if="pagination.last_page > 1" class="flex justify-between items-center">
      <div class="text-sm text-gray-600 dark:text-gray-400">
        Showing {{ ((pagination.current_page - 1) * pagination.per_page) + 1 }}
        to {{ Math.min(pagination.current_page * pagination.per_page, pagination.total) }}
        of {{ pagination.total }} results
      </div>

      <UPagination v-model:page="currentPage" :items-per-page="pagination.per_page" :total="pagination.total" />
    </div>
  </div>
</template>