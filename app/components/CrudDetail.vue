<!-- app/components/CrudDetail.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { ResourceConfig } from '~/types/crud'

interface Props {
  config: ResourceConfig<T>
  item: T | null
  loading?: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  edit: []
  delete: []
  back: []
}>()

// Get fields that should show in detail view
const detailFields = computed(() => 
  props.config.fields.filter(f => f.showInDetail !== false)
)

// Render field value
const renderValue = (field: any, item: T) => {
  const value = item[field.key]
  
  if (field.render) {
    return field.render(value, item)
  }
  
  if (value === null || value === undefined) {
    return '-'
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  
  if (field.type === 'date' && value) {
    return new Date(value).toLocaleDateString()
  }
  
  return String(value)
}
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">
          {{ config.singularName }} Details
        </h3>
        <div class="flex gap-2">
          <UButton
            icon="i-heroicons-pencil-square"
            size="sm"
            color="primary"
            @click="emit('edit')"
            :disabled="loading"
          >
            Edit
          </UButton>
          <UButton
            icon="i-heroicons-trash"
            size="sm"
            color="red"
            variant="outline"
            @click="emit('delete')"
            :disabled="loading"
          >
            Delete
          </UButton>
        </div>
      </div>
    </template>

    <div v-if="loading" class="flex justify-center py-8">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8" />
    </div>

    <div v-else-if="!item" class="text-center py-8 text-gray-500">
      No data available
    </div>

    <dl v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <div
        v-for="field in detailFields"
        :key="field.key"
        class="py-4 sm:grid sm:grid-cols-3 sm:gap-4"
      >
        <dt class="text-sm font-medium text-gray-500 dark:text-gray-400">
          {{ field.label }}
        </dt>
        <dd class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
          {{ renderValue(field, item) }}
        </dd>
      </div>
    </dl>

    <template #footer>
      <div class="flex justify-start">
        <UButton
          icon="i-heroicons-arrow-left"
          color="gray"
          variant="ghost"
          @click="emit('back')"
        >
          Back to {{ config.name }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>