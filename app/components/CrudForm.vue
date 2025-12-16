<!-- app/components/CrudForm.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { ResourceConfig, ApiError } from "~/types/crud";

interface Props {
  config: ResourceConfig<T>;
  initialData?: Partial<T>;
  loading?: boolean;
  error?: ApiError | null;
  mode?: "create" | "edit";
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
});

const emit = defineEmits<{
  submit: [data: Partial<T>];
  cancel: [];
}>();

// Form fields that should show in form
const formFields = computed(() => {
  return props.config.fields.filter((field) => {
    if (props.mode === "create") {
      return field.showInFormCreate ?? false;
    }

    if (props.mode === "edit") {
      return field.showInFormEdit ?? false;
    }

    return false;
  });
});

// Form state
const formData = ref<Record<string, any>>({});

// Initialize form data
onMounted(() => {
  formFields.value.forEach((field) => {
    if (props.initialData && field.key in props.initialData) {
      formData.value[field.key] = props.initialData[field.key];
    } else if (field.type === "checkbox") {
      formData.value[field.key] = false;
    } else if (field.type === "file") {
      formData.value[field.key] = null;
    } else if (field.key === "criteria") {
      formData.value.criteria = {};
    } else {
      formData.value[field.key] = "";
    }
  });
});

// Watch for initialData changes (edit mode)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.keys(newData).forEach((key) => {
        if (key === "criteria") {
          try {
            formData.value.criteria =
              typeof newData.criteria === "string"
                ? JSON.parse(newData.criteria)
                : newData.criteria || {};
          } catch (e) {
            console.error("Invalid criteria JSON", newData.criteria);
            formData.value.criteria = {};
          }
        } else {
          formData.value[key] = newData[key];
        }
      });
    }
  },
  { deep: true }
);

watch(() => formData.value.type, (newType, oldType) => {
  if(props.mode === "edit") return; // Only reset criteria in create mode
  if(newType !== oldType){
    formData.value.criteria = {} // Reset old criteria
  }
})

const criteriaKeyMap: Record<string, string> = {
  streak: "days_required",
  course_completion: "course_required",
  points: "points_required",
  lesson_completion: "lessons_required",
  time_spent: "minutes_required",
};

const currentCriteriaKey = computed(() => {
  return criteriaKeyMap[formData.value.type] || "";
});

// Local validation errors
const validationErrors = ref<Record<string, string>>({});

// Validate single field
const validateField = (field: any) => {
  const value = formData.value[field.key];

  if (field.required) {
    if (field.type === "file" && !value) {
      validationErrors.value[field.key] = `${field.label} is required`;
      return false;
    }

    if (!value && field.type !== "file") {
      validationErrors.value[field.key] = `${field.label} is required`;
      return false;
    }
  }

  if (field.validation) {
    const error = field.validation(value);
    if (error) {
      validationErrors.value[field.key] = error;
      return false;
    }
  }

  delete validationErrors.value[field.key];
  return true;
};

const handleFileChange = (fieldKey: string, event: Event) => {
  const input = event.target as HTMLInputElement;
  const files = input.files;

  if (!files || files.length === 0) {
    formData.value[fieldKey] = null;
    return;
  }

  // Single file (default)
  formData.value[fieldKey] = files[0];
};

// Validate all fields
const validateForm = () => {
  validationErrors.value = {};
  let isValid = true;

  formFields.value.forEach((field) => {
    if (!validateField(field)) {
      isValid = false;
    }
  });

  return isValid;
};

// Handle submit
const handleSubmit = () => {
  if (!validateForm()) {
    return;
  }

  const dataToSubmit = { ...formData.value };

  // Convert criteria object to JSON string
  if (dataToSubmit.criteria && typeof dataToSubmit.criteria === 'object') {
    dataToSubmit.criteria = JSON.stringify(dataToSubmit.criteria);
  }

  console.log("Submitting data:", dataToSubmit); // For debugging

  emit("submit", dataToSubmit as Partial<T>);
};

// Get error message for field
const getFieldError = (fieldKey: string) => {
  // Check local validation errors first
  if (validationErrors.value[fieldKey]) {
    return validationErrors.value[fieldKey];
  }

  // Check API errors
  if (props.error?.errors?.[fieldKey]) {
    return props.error.errors[fieldKey][0];
  }

  return undefined;
};

const isExistingFile = (value: any) => {
  return typeof value === "string" && value.length > 0;
};
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ mode === "create" ? "Create" : "Edit" }} {{ config.singularName }}
      </h3>
    </template>

    <UForm @submit.prevent="handleSubmit" class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- API Error Message -->
      <UAlert v-if="error?.message" color="error" variant="soft" :title="error.message" :close-button="{
        icon: 'i-heroicons-x-mark-20-solid',
        color: 'red',
        variant: 'link',
      }" />

      <!-- Form Fields -->
      <div v-for="field in formFields" :key="field.key">
        <!-- Text Input -->
        <UFormField v-if="
          field.type === 'text' ||
          field.type === 'email' ||
          field.type === 'password'
        " :label="field.label" :required="field.required" :error="getFieldError(field.key)">
          <UInput class="w-full" v-model="formData[field.key]" :type="field.type" :placeholder="field.label"
            @blur="validateField(field)" />
        </UFormField>

        <!-- Number Input -->
        <UFormField v-else-if="field.type === 'number'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <UInput class="w-full" v-model.number="formData[field.key]" type="number" :placeholder="field.label"
            @blur="validateField(field)" />
        </UFormField>

        <!-- Textarea -->
        <UFormField v-else-if="field.type === 'textarea'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <UTextarea class="w-full" v-model="formData[field.key]" :placeholder="field.label" :rows="4"
            @blur="validateField(field)" />
        </UFormField>

        <!-- Checkbox -->
        <UFormField v-else-if="field.type === 'checkbox'" :label="field.label" :error="getFieldError(field.key)">
          <UCheckbox class="w-full" v-model="formData[field.key]" :label="field.label" />
        </UFormField>

        <!-- Date -->
        <UFormField v-else-if="field.type === 'date'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <UInput class="w-full" v-model="formData[field.key]" type="date" @blur="validateField(field)" />
        </UFormField>

        <!-- File Upload -->
        <UFormField v-else-if="field.type === 'file'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <UInput type="file"
            class="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
            @change="handleFileChange(field.key, $event)" />

          <!-- File preview -->
          <p v-if="formData[field.key]?.name" class="mt-1 text-xs text-gray-500">
            Selected: {{ formData[field.key].name }}
          </p>

          <p v-else-if="isExistingFile(formData[field.key])" class="mt-1 text-xs text-gray-500">
            Current file already uploaded
          </p>
        </UFormField>

        <!-- Select -->
        <UFormField v-else-if="field.type === 'select'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <USelect class="w-full" v-model="formData[field.key]" :items="field.options || []"
            @blur="validateField(field)" />
        </UFormField>
      </div>

      <UFormField v-if="currentCriteriaKey" :label="`Required ${currentCriteriaKey.replace('_', ' ')}`" required
        :error="getFieldError('criteria')">
        <UInput class="w-full" type="number" v-model.number="formData.criteria[currentCriteriaKey]"
          :placeholder="`Enter ${currentCriteriaKey.replace('_', ' ')}`"
          @blur="validateField({ key: 'criteria', required: true })" />
      </UFormField>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4 w-full col-span-1 md:col-span-2">
        <UButton type="button" color="neutral" variant="ghost" @click="emit('cancel')" :disabled="loading">
          Cancel
        </UButton>
        <UButton type="submit" :loading="loading" :disabled="loading">
          {{ mode === "create" ? "Create" : "Update" }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>
