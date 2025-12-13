<script setup lang="ts">
import { computed } from "vue";
import { useBadgesCreate } from "~/composables/badges/create";

const {
  schema,
  state,

  types,
  activeCriteriaKey,

  // uploads
  imageFile,
  uploadProgress,
  uploadError,
  isUploading,

  // methods
  onImageChange,
  onError,
  formSubmit,
  formatFileSize,
} = useBadgesCreate();

// Computed placeholder for dynamic criteria input
const criteriaPlaceholder = computed(() => {
  return activeCriteriaKey.value
    ? `Enter ${activeCriteriaKey.value}`
    : "";
});
</script>

<template>
  <div>
    <UCard>
      <UForm @submit.prevent="formSubmit" class="grid grid-cols-2 m-2 gap-3">

        <!-- Header -->
        <div class="flex items-center justify-between border-b pb-3 col-span-2">
          <h2 class="text-xl font-bold text-gray-900">Create New Badge</h2>
        </div>

        <!-- Name -->
        <UFormField label="Name" name="name" class="col-span-2">
          <UInput v-model="state.name" placeholder="Enter Badge Name" class="w-full max-w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" name="description" class="col-span-2">
          <UTextarea v-model="state.description" :rows="2" placeholder="Enter Badge Description" class="w-full max-w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Image Upload -->
        <UFormField label="Icon Image File" name="icon" class="col-span-2">
          <div class="relative group border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer">
            <UInput type="file" accept="image/*" @change="onImageChange"
              class="absolute inset-0 opacity-0 cursor-pointer" />
            <UIcon name="i-heroicons-photo" class="w-8 h-8 mx-auto text-gray-400" />
            <p class="text-sm text-gray-600">
              Drop your image or <span class="text-primary font-semibold">browse</span>
            </p>
            <p v-if="imageFile" class="mt-2 text-sm text-gray-500">
              Selected file: {{ imageFile.name }} ({{ formatFileSize(imageFile.size) }})
            </p>
          </div>
        </UFormField>

        <!-- Badge Type -->
        <UFormField label="Type" name="type" class="col-span-1">
          <USelectMenu v-model="state.type" :items="types" placeholder="Select badge type" class="w-full max-w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Dynamic Criteria Input -->
        <template v-if="state.type && activeCriteriaKey">
          <UFormField :label="activeCriteriaKey" class="col-span-1">
            <UInput
              type="number"
              min="0"
              v-model.number="state.criteria[activeCriteriaKey!]"
              :placeholder="criteriaPlaceholder"
              class="w-full max-w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30"
            />
          </UFormField>
        </template>

        <!-- Points -->
        <UFormField label="Points" name="points" class="col-span-2">
          <UInput type="number" min="0" v-model.number="state.points" placeholder="Enter badge points" class="w-full max-w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="col-span-2">
          <p class="text-sm text-gray-600">Uploading... {{ uploadProgress }}%</p>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div class="bg-blue-500 h-2 rounded-full" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>

        <!-- Upload Error -->
        <p v-if="uploadError" class="col-span-2 text-red-500">{{ uploadError }}</p>

        <!-- Submit Button -->
        <div class="col-span-2 flex justify-end mt-3">
          <UButton type="submit" :loading="isUploading">Create Badge</UButton>
        </div>

      </UForm>
    </UCard>
  </div>
</template>

<style scoped>
/* Optional: make the file input container look nice on hover */
.group:hover {
  border-color: #3b82f6; /* Tailwind blue-500 */
}
</style>
