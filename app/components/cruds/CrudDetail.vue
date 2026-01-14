<!-- app/components/CrudsCrudDetail.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { ResourceConfig } from "~/types/crud";

interface Props {
  config: ResourceConfig<T>;
  item: T | null;
  loading?: boolean;
  edit?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
edit: true,
});

const emit = defineEmits<{
  edit: [];
  delete: [];
  back: [];
}>();

// Get fields that should show in detail view
const detailFields = computed(() =>
  props.config.fields.filter((f) => f.showInDetail !== false)
);

// Render field value
const renderValue = (field: any, item: T) => {
  const value = item[field.key];

  if (field.render) {
    return field.render(value, item);
  }

  if (value === null || value === undefined) {
    return "-";
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (field.type === "date" && value) {
    return new Date(value).toLocaleDateString();
  }

  if (field.type === "datetime" && value) {
    return new Date(value).toLocaleString();
  }

  if (field.type == "color" && value) {
    return `<div class="w-5 h-5 rounded-full" style="background-color: ${value}"></div>`;
  }

  return String(value);
};

const formatJson = (value: any) => {
  if (!value) return [];

  let obj = value;
  // If it's a string, try to parse it
  if (typeof value === "string") {
    try {
      obj = JSON.parse(value);
    } catch (e) {
      return []; // Not valid JSON
    }
  }

  // Ensure we are dealing with an object/array
  if (typeof obj === "object" && obj !== null) {
    return Object.entries(obj);
  }

  return [];
};
</script>

<template>
  <UCard>
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-lg font-semibold">{{ config.singularName }} Details</h3>
        <div class="flex gap-2">
          <UButton v-if="edit" icon="i-heroicons-pencil-square" size="sm" color="primary" @click="emit('edit')" :disabled="loading">
            Edit
          </UButton>
        </div>
      </div>
    </template>

    <SkeletonDetailsSkeletonLoader v-if="loading" :field-count="detailFields.length" :show-header="false"
      :show-footer="false" />

    <div v-else-if="!item" class="text-center py-8 text-gray-500">
      No data available
    </div>

    <dl v-else class="divide-y divide-gray-200 dark:divide-gray-700">
      <div v-for="field in detailFields" :key="field.key" class="py-4 sm:grid sm:grid-cols-3 sm:gap-4">
        <dt class="text-sm font-medium text-black dark:text-gray-400">
          {{ field.label }}
        </dt>
        <!-- file image -->
        <dd v-if="field.type == 'file' && field.fileType == 'image'">
          <div class="mt-1 sm:col-span-2 sm:mt-0">
            <!-- avatar -->
            <UAvatar v-if="item[field.key]" :src="item[field.key]" :alt="field.label" size="lg"
              class="border border-gray-300 dark:border-gray-600" />
            <div v-else class="text-sm text-gray-500 dark:text-gray-400">
              No file uploaded
            </div>
          </div>
        </dd>
        <!-- file video -->
        <dd v-else-if="field.type == 'file' && field.fileType == 'video'">
          <a :href="item[field.key]">watch video</a>
        </dd>
        <!-- JSON -->
        <dd v-else-if="field.type === 'json'" class="mt-1 text-sm sm:col-span-2">
          <div v-if="formatJson(item[field.key]).length > 1">
            <div v-for="[key, val] in formatJson(item[field.key])" :key="key" class="mb-1">
              <span class="font-bold text-gray-700 dark:text-gray-300">{{ key }}</span>
              <span class="mx-1">=></span>
              <span class="text-gray-600 dark:text-gray-400" v-for="[key, value] in formatJson(val)">
                {{ key }} --> {{ value }} \
              </span>
            </div>
          </div>
          <div v-else-if="formatJson(item[field.key]).length == 1">
            <div v-for="[key, val] in formatJson(item[field.key])" :key="key" class="mb-1">
              <span class="font-bold text-gray-700 dark:text-gray-300">{{ key }}</span>
              <span class="mx-1">=></span>
              <span class="text-gray-600 dark:text-gray-400">
                {{ val }}
              </span>
            </div>
          </div>
          <div v-else class="text-gray-400 italic">
            No data
          </div>
        </dd>
        <dd v-else class="mt-1 text-sm text-gray-900 dark:text-gray-100 sm:col-span-2 sm:mt-0">
          <div class="leading-relaxed" v-html="renderValue(field, item)"></div>
        </dd>
      </div>
    </dl>

    <template #footer>
      <div class="flex justify-start">
        <UButton icon="i-heroicons-arrow-left" color="neutral" variant="ghost" @click="emit('back')">
          Back to {{ config.name }}
        </UButton>
      </div>
    </template>
  </UCard>
</template>
