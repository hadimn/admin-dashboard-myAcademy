import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import * as v from "valibot";

export const useCoursesCreate = () => {
  // configuration to get api url
  const config = useRuntimeConfig();

  const toast = useToast();

  const imageFile = ref<File | null>(null);
  const videoFile = ref<File | null>(null);

  // Upload progress state
  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  const schema = v.object({
    title: v.pipe(v.string(), v.minLength(1, "Title is required")),
    description: v.pipe(
      v.string(),
      v.minLength(8, "Description Must Be At Least 8 Characters")
    ),
    language: v.picklist(["ar", "en", "sp", "fr"], "Invalid language"),
    order: v.optional(v.number("Must Be A Number!")),
    image_url: v.optional(
      v.pipe(
        v.blob(),
        v.mimeType(
          ["image/jpeg", "image/jpg", "image/png"],
          "Please Select A jpg, jpeg or png file"
        )
      )
    ),
    video_url: v.optional(v.blob()),
  });

  type Schema = v.InferOutput<typeof schema>;

  const state = reactive<{
    title: string | undefined;
    description: string | undefined;
    language: "ar" | "en" | "sp" | "fr" | undefined;
    order: number | undefined;
    image_url: File | undefined;
    video_url: File | undefined;
  }>({
    title: undefined,
    description: undefined,
    language: undefined,
    order: undefined,
    image_url: undefined,
    video_url: undefined,
  });

  const languages = ["ar", "en", "sp", "fr"];

  function onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      imageFile.value = file;
      state.image_url = file;
    }
  }

  function onVideoChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      videoFile.value = file;
      state.video_url = file;
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

  async function formSubmit(event: FormSubmitEvent<Schema>) {
    if (isUploading.value) {
      toast.add({
        title: "failed",
        description: "Upload already in progress",
        color: "error",
      });
      return;
    }

    try {
      isUploading.value = true;
      uploadProgress.value = 0;
      uploadError.value = null;

      const form = new FormData();
      form.append("title", event.data.title);
      form.append("description", event.data.description);
      form.append("order", String(event.data.order));
      form.append("language", event.data.language);

      if (videoFile.value) {
        form.append("video_url", videoFile.value);
      }

      if (imageFile.value) {
        form.append("image_url", imageFile.value);
      }

      await uploadWithProgress(form);
      navigateTo(`/courses`);
      toast.add({
        title: "success",
        description: "course has been create successfuly!",
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
    console.log(event.data);
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
            const response = xhr.responseText
              ? JSON.parse(xhr.responseText)
              : {};
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
      xhr.open("POST", `${config.public.apiBaseUrl}/courses`);
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

  return {
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
  };
};
