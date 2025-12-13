import type { FormError, FormErrorEvent } from "@nuxt/ui";
import { useShowCourse } from "~/composables/Courses/showCourse";
import { useRoute, useRouter } from "vue-router";

interface Schema {
  title: string;
  description: string;
  language: string;
  order: number;
}

export function useEditCourse() {
  const route = useRoute();
  const courseId = route.params.id as string;

  // Use your composable to fetch the course
  const { course, pending, error, refetch } = useShowCourse(courseId);

  const config = useRuntimeConfig();
  const toast = useToast();

  const imageFile = ref<File | null>(null);
  const videoFile = ref<File | null>(null);

  // Upload progress state
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  const state = reactive<Schema>({
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

  // Validation function
  function validate(state: Partial<Schema>): FormError[] {
    const errors: FormError[] = [];
    if (!state.title) errors.push({ name: "title", message: "Required" });
    if (!state.description)
      errors.push({ name: "description", message: "Required" });
    if (!state.language) errors.push({ name: "language", message: "Required" });
    if (state.order == null) errors.push({ name: "order", message: "Required" });
    return errors;
  }

  // Event handlers
  function onImageFileChange(e: Event) {
    const target = e.target as HTMLInputElement;
    if (target.files?.[0]) {
      imageFile.value = target.files[0];
    }
    console.log(imageFile.value);
  }

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

  // Form submission
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
      navigateTo(`/courses/${courseId}`);
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

  // Form error handler
  async function onError(event: FormErrorEvent) {
    if (event?.errors?.[0]?.id) {
      const element = document.getElementById(event.errors[0].id);
      element?.focus();
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  // Language options
  const languages = ["en", "es", "fr", "ar"].map((lang) => ({
    label: lang,
    value: lang,
  }));

  // Cleanup function to cancel upload if component unmounts
  onBeforeUnmount(() => {
    // You could implement abort logic here if needed
    if (isUploading.value) {
      console.log("Upload in progress during unmount");
    }
  });

  // Initial mount check
  onMounted(() => {
    if (!pending && !course.value) {
      toast.add({
        title: "failed",
        description: "",
        color: "error",
      });
      throw createError({
        statusCode: 500,
        statusMessage: "Page Not Found!",
        message:
          "The page you are trying to reach might have been moved, deleted, or temporarily unavailable.",
        fatal: true,
      });
    }
  });

  return {
    // State
    course,
    pending,
    error,
    uploadError,
    isUploading,
    uploadProgress,
    state,
    imageFile,
    videoFile,
    
    // Methods
    onImageFileChange,
    onVideoFileChange,
    formSubmit,
    onError,
    validate,
    formatFileSize,
    
    // Constants
    languages,
    courseId
  };
}