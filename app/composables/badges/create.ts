import type { FormErrorEvent, FormSubmitEvent } from "@nuxt/ui";
import { useRuntimeConfig, useToast } from "#imports";
import * as v from "valibot";
import type { badge } from "~/types/badge";

export const useBadgesCreate = () => {
  const config = useRuntimeConfig();
  const toast = useToast();

  const imageFile = ref<File | null>(null);

  const uploadProgress = ref(0);
  const isUploading = ref(false);
  const uploadError = ref<string | null>(null);

  // Badge types
  const types = [
    "streak",
    "course_completion",
    "points",
    "lesson_completion",
    "time_spent",
  ];

  type BadgeType = (typeof types)[number];

  const criteriaMap: Record<BadgeType, string> = {
    streak: "days_required",
    course_completion: "courses_required",
    points: "points_required",
    lesson_completion: "lessons_required",
    time_spent: "minutes_required",
  };

  // ------------------------------
  // Validation Schema Using Valibot
  // ------------------------------

  const schema = v.object({
    name: v.pipe(v.string(), v.minLength(1, "Name is required")),
    description: v.pipe(v.string(), v.minLength(5, "Description too short")),
    type: v.picklist(types, "Invalid badge type"),
    icon: v.optional(
      v.pipe(
        v.blob(),
        v.mimeType(
          ["image/jpeg", "image/png", "image/jpg"],
          "Only JPG or PNG allowed"
        )
      )
    ),
    criteria: v.record(v.string(), v.number("Must be a number!")),
  });

  type Schema = v.InferOutput<typeof schema>;

  // ------------------------------
  // Initial State
  // ------------------------------

  const state = reactive<badge>({
    badge_id: 0,
    name: "",
    description: "",
    icon: "",
    type: "" as BadgeType,
    criteria: {},
    points: 0,
  });

  // ------------------------------
  // Auto-update criteria key on type change
  // ------------------------------

  const activeCriteriaKey = computed(() => {
    if (!state.type) return "";
    return criteriaMap[state.type as BadgeType];
  });

  watch(
    () => state.type,
    (newType) => {
      if (!newType) return;

      const key = criteriaMap[newType as BadgeType];
      state.criteria = { [key as string]: 0 }; // default value
    }
  );

  // ------------------------------
  // Image Upload Handling
  // ------------------------------

  function onImageChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      imageFile.value = file;
      state.icon = file.name;
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }

  // ------------------------------
  // Submit Form
  // ------------------------------

  async function formSubmit(event: FormSubmitEvent<Schema>) {
    if (isUploading.value) return;

    try {
      isUploading.value = true;
      uploadProgress.value = 0;

      const form = new FormData();
      form.append("name", state.name);
      form.append("description", state.description);
      form.append("type", state.type);
      form.append("criteria", JSON.stringify(state.criteria));
      form.append("points", String(state.points));

      if (imageFile.value) {
        form.append("icon", imageFile.value);
      }

      await uploadWithProgress(form);

      toast.add({
        title: "Success",
        description: "Badge created successfully",
        color: "success",
      });

      navigateTo("/badges");
    } catch (error) {
      toast.add({
        title: "Error",
        description: String(error),
        color: "error",
      });
    } finally {
      isUploading.value = false;
    }
  }

  // ------------------------------
  // Upload logic (with progress)
  // ------------------------------

  function uploadWithProgress(formData: FormData): Promise<any> {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          uploadProgress.value = Math.round((event.loaded / event.total) * 100);
        }
      });

      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText || "{}"));
        } else {
          reject(new Error(xhr.statusText));
        }
      });

      xhr.addEventListener("error", () => reject(new Error("Upload failed")));

      xhr.open("POST", `${config.public.apiBaseUrl}/badges`);
      xhr.send(formData);
    });
  }

  async function onError(event: FormErrorEvent) {
    if (event.errors?.[0]?.id) {
      const el = document.getElementById(event.errors[0].id);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  return {
    schema,
    state,

    types,
    criteriaMap,
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
  };
};
