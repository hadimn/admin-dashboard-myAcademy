<script setup lang="ts">
import type { FormError, FormErrorEvent } from "@nuxt/ui";
import { useShowCourse } from "~/composables/Courses/showCourse";

const route = useRoute();
const courseId = route.params.id;

// Use your composable to fetch the course
const { course, pending, error, refetch } = useShowCourse(courseId);

const config = useRuntimeConfig();

const imageFile = ref<File | null>(null);
const videoFile = ref<File | null>(null);

// Upload progress state
const uploadProgress = ref(0);
const isUploading = ref(false);
const uploadError = ref<string | null>(null);

const state = reactive({
  title: "",
  description: "",
  language: "",
  order: 0,
});

// When course data is loaded, populate the form
watch(
  course,
  (newCourse) => {
    if (newCourse?.data) {
      state.title = newCourse.data.title || "";
      state.description = newCourse.data.description || "";
      state.language = newCourse.data.language || "";
      state.order = newCourse.data.order ?? 0;
    }
  },
  { immediate: true }
);

type Schema = typeof state;

function validate(state: Partial<Schema>): FormError[] {
  const errors: FormError[] = [];
  if (!state.title) errors.push({ name: "title", message: "Required" });
  if (!state.description)
    errors.push({ name: "description", message: "Required" });
  if (!state.language) errors.push({ name: "language", message: "Required" });
  if (state.order == null) errors.push({ name: "order", message: "Required" });
  return errors;
}

function onImageFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    imageFile.value = target.files[0];
  }
}

const languages = ["en", "es", "fr", "ar"].map((lang) => ({
  label: lang,
  value: lang,
}));

function onVideoFileChange(e: Event) {
  const target = e.target as HTMLInputElement;
  if (target.files?.[0]) {
    videoFile.value = target.files[0];
  }
}

// Helper function to calculate file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

const toast = useToast();

async function formSubmit() {
  // Prevent multiple submissions
  if (isUploading.value) {
    toast.add({
      title: "failed",
      description: "Upload already in progress",
      color: "error",
    });
    console.log("Upload already in progress");
    return;
  }

  try {
    // Reset states
    isUploading.value = true;
    uploadProgress.value = 0;
    uploadError.value = null;

    const form = new FormData();
    form.append("_method", "PUT");
    form.append("title", state.title);
    form.append("description", state.description);
    form.append("language", state.language);
    form.append("order", String(state.order));

    if (videoFile.value) {
      console.log(
        `Video file: ${videoFile.value.name} (${formatFileSize(
          videoFile.value.size
        )})`
      );
      form.append("video_url", videoFile.value);
    }

    if (imageFile.value) {
      form.append("image_url", imageFile.value);
    }

    // Use XMLHttpRequest for progress tracking
    await uploadWithProgress(form);
    toast.add({
      title: "success",
      description: "course has been updated successfuly!",
      color: "success",
    });
  } catch (error) {
    console.error("Upload error:", error);
    uploadError.value =
      error instanceof Error ? error.message : "Upload failed";
    toast.add({
      title: "failed to uplad due to an error",
      description: `${error}`,
      color: "error",
    });
  } finally {
    isUploading.value = false;
  }
}

// XMLHttpRequest implementation for progress tracking
function uploadWithProgress(formData: FormData): Promise<any> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    // Progress event
    xhr.upload.addEventListener("progress", (event) => {
      if (event.lengthComputable) {
        const progress = Math.round((event.loaded / event.total) * 100);
        uploadProgress.value = progress;
        console.log(`Upload progress: ${progress}%`);
      }
    });

    // Load event (success)
    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try {
          const response = xhr.responseText ? JSON.parse(xhr.responseText) : {};
          console.log("Upload complete:", response);

          // Navigate after successful upload
          navigateTo(`/courses/${courseId}?refresh=true`);
          resolve(response);
        } catch (error) {
          reject(new Error("Failed to parse response"));
        }
      } else {
        reject(new Error(`Upload failed: ${xhr.statusText}`));
      }
    });

    // Error event
    xhr.addEventListener("error", () => {
      reject(new Error("Network error during upload"));
    });

    // Abort event
    xhr.addEventListener("abort", () => {
      reject(new Error("Upload was cancelled"));
    });

    // Open and send request
    xhr.open("POST", `${config.public.apiBaseUrl}/courses/${courseId}`);
    xhr.send(formData);
  });
}

async function onError(event: FormErrorEvent) {
  if (event?.errors?.[0]?.id) {
    const element = document.getElementById(event.errors[0].id);
    element?.focus();
    element?.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}

// Alternative: Using fetch with progress (if your backend supports streaming)
async function uploadWithFetchProgress(formData: FormData): Promise<void> {
  const response = await fetch(
    `${config.public.apiBaseUrl}/courses/${courseId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`);
  }

  // Note: Fetch API doesn't have built-in upload progress tracking
  // The reader is for download progress, not upload
  const reader = response.body?.getReader();
  const contentLength = response.headers.get("Content-Length");

  if (reader && contentLength) {
    let receivedLength = 0;
    const totalLength = parseInt(contentLength);

    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        break;
      }

      receivedLength += value.length;
      // This tracks DOWNLOAD progress, not upload
      const progress = Math.round((receivedLength / totalLength) * 100);
      console.log(`Download progress: ${progress}%`);
    }
  }

  const result = await response.json();
  navigateTo(`/courses/${courseId}?refresh=true`);
  return result;
}

// Cleanup function to cancel upload if component unmounts
onBeforeUnmount(() => {
  // You could implement abort logic here if needed
  if (isUploading.value) {
    console.log("Upload in progress during unmount");
  }
});
</script>

<template>
  <!-- Loading / Error -->
  <div v-if="pending" class="mb-4">
    <UProgress :value="50" />
  </div>

  <div v-if="error" class="mb-4 bg-error-50 p-4 rounded">
    {{ error.message }}
  </div>

  <!-- Upload Error -->
  <div v-if="uploadError" class="mb-4 bg-error-50 p-4 rounded">
    Upload Error: {{ uploadError }}
  </div>

  <!-- Form -->
  <UCard v-if="course?.data" class="bg-white/70 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-3xl p-8">
    <UForm :validate="validate" :state="state" class="space-y-10" @submit="formSubmit" @error="onError">
      <!-- Header -->
      <div class="flex items-center justify-between border-b pb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900">Edit Course</h2>
        </div>
      </div>

      <!-- Form Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Title -->
        <UFormField label="Title" name="title" required>
          <UInput size="xl" v-model="state.title" placeholder="Enter course title"
            class="rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Description -->
        <UFormField label="Description" name="description" required class="lg:col-span-2">
          <UTextarea v-model="state.description" :rows="2" :maxrows="2" placeholder="Write a short course description"
            class="rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Video Upload -->
        <UFormField label="Video File">
          <div
            class="relative group border-2 border-dashed rounded-2xl p-5 text-center transition-all hover:border-primary hover:bg-primary/5">
            <UInput type="file" @change="onVideoFileChange" accept="video/*" :disabled="isUploading"
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

        <!-- Image Upload -->
        <UFormField label="Image File">
          <div
            class="relative group border-2 border-dashed rounded-2xl p-5 text-center transition-all hover:border-primary hover:bg-primary/5">
            <UInput type="file" @change="onImageFileChange" accept="image/*" :disabled="isUploading"
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
          <USelect v-model="state.language" :items="languages" placeholder="Select language" :disabled="isUploading"
            class="rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>

        <!-- Order -->
        <UFormField label="Display Order" name="order">
          <UInput v-model="state.order" type="number" min="0" placeholder="0" :disabled="isUploading"
            class="rounded-xl shadow-sm focus:ring-2 focus:ring-primary/30" />
        </UFormField>
      </div>

      <div class="flex justify-between items-center">
        <!-- cancel button -->
        <UButton :to="`/courses/${courseId}`" color="error" size="lg" :disabled="isUploading"
          class="px-10 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          Cancel
        </UButton>
        <!-- submit button -->
        <UButton type="submit" color="primary" size="lg" :loading="isUploading" :disabled="isUploading"
          class="px-10 py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300">
          <template #leading v-if="isUploading">
            <UIcon name="i-heroicons-arrow-path-20-solid" class="w-5 h-5 animate-spin" />
          </template>

          {{ isUploading ? "Uploading..." : "Save Changes" }}
        </UButton>
      </div>

      <!-- Upload Progress -->
      <div v-if="isUploading" class="mt-10 bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
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

  <!-- Course missing alert -->
  <div v-if="!course?.data && !pending && !error">
    <UAlert icon="i-heroicons-exclamation-triangle" color="warning" variant="soft" title="Warning!"
      :description="`Course with ID ${courseId} is missing!`" :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'orange',
        variant: 'link',
      }" />
  </div>
</template>
