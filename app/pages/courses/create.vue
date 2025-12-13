<script setup lang="ts">
import { useCoursesCreate } from '~/composables/Courses/create';

// Import composable functions
const {
  schema,
  state,
  uploadError,
  isUploading,
  uploadProgress,

  // Methods
  onVideoChange,
  onImageChange,
  onError,
  formatFileSize,
  formSubmit,

  // Constants
  languages,
  videoFile,
  imageFile,
} = useCoursesCreate();
</script>

<template>
  <div>
    <UCard>
      <UForm @error="onError" :schema="schema" :state="state" class="grid grid-cols-2 m-2 gap-3" @submit="formSubmit">
        <!-- Header -->
        <div class="flex items-center justify-between border-b pb-3 col-span-2">
          <div>
            <h2 class="text-xl font-bold text-gray-900">Create New Course</h2>
          </div>
        </div>

        <!-- title input -->
        <UFormField label="Title" name="title" required class="col-span-2">
          <UInput v-model="state.title" placeholder="Write a short course title"
            class="w-full max-w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- description input -->
        <UFormField label="Description" name="description" required class="col-span-2">
          <UTextarea v-model="state.description" :rows="2" :maxrows="2" placeholder="Write a short course description"
            class="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- video input -->
        <UFormField label="Video File" name="video_url" class="col-span-2">
          <div
            class="relative group border-2 border-dashed rounded-2xl p-5 text-center transition-all hover:border-primary hover:bg-primary/5">
            <UInput @change="onVideoChange" type="file" accept="video/*"
              class="absolute inset-0 opacity-0 cursor-pointer" />

            <div class="space-y-2">
              <UIcon name="i-heroicons-video-camera" class="w-8 h-8 mx-auto text-gray-400 group-hover:text-primary" />

              <p class="text-sm text-gray-600">
                Drop your video or
                <span class="text-primary font-semibold">browse</span>
              </p>

              <p v-if="videoFile" class="text-xs text-gray-500 mt-2">
                {{ videoFile.name }} ({{ formatFileSize(videoFile.size) }})
              </p>
            </div>
          </div>
        </UFormField>

        <!-- image input -->
        <UFormField label="Image File" name="image_url" class="col-span-2">
          <div
            class="relative group border-2 border-dashed rounded-2xl p-5 text-center transition-all hover:border-primary hover:bg-primary/5">
            <UInput @change="onImageChange" type="file" accept="image/*" :disabled="isUploading"
              class="absolute inset-0 opacity-0 cursor-pointer" />

            <div class="space-y-2">
              <UIcon name="i-heroicons-photo" class="w-8 h-8 mx-auto text-gray-400 group-hover:text-primary" />

              <p class="text-sm text-gray-600">
                Drop your image or
                <span class="text-primary font-semibold">browse</span>
              </p>

              <p v-if="imageFile" class="text-xs text-gray-500 mt-2">
                {{ imageFile.name }} ({{ formatFileSize(imageFile.size) }})
              </p>
            </div>
          </div>
        </UFormField>

        <!-- Language -->
        <UFormField label="Language" name="language" required>
          <USelectMenu v-model="state.language" :items="languages" placeholder="Select language"
            class="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Order -->
        <UFormField label="Display Order" name="order">
          <UInput v-model="state.order" type="number" min="0" placeholder="0"
            class="w-full rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <div class="col-span-2 flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center">
          <!-- cancel button -->
          <UButton to="/courses" color="error" size="md"
            class="w-full sm:w-auto px-6 sm:px-10 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            Cancel
          </UButton>
          <!-- submit button -->
          <UButton type="submit" color="primary" size="md" :loading="isUploading" :disabled="isUploading"
            class="w-full sm:w-auto px-6 sm:px-10 py-2.5 rounded-2xl shadow-lg hover:shadow-xl transition-all">
            <template #leading v-if="isUploading">
              <UIcon name="i-heroicons-arrow-path-20-solid" class="w-5 h-5 animate-spin" />
            </template>

            {{ isUploading ? "Uploading..." : "Save Changes" }}
          </UButton>
        </div>

        <!-- Upload Progress -->
        <div v-if="isUploading" class="col-span-2 mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
          <div class="flex justify-between items-center">
            <span class="text-sm font-semibold text-gray-700">
              Uploading course media
            </span>
            <span class="text-sm font-medium text-primary">
              {{ uploadProgress }}%
            </span>
          </div>

          <UProgress :value="uploadProgress" :max="100" class="h-3 rounded-full" />

          <p class="text-center text-xs text-gray-500">
            Please don't close this page while uploading
          </p>
        </div>
      </UForm>
    </UCard>
  </div>
</template>
