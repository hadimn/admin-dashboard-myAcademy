<!-- app/components/CrudForm.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { ResourceConfig, ApiError } from "~/types/crud";
import FormSkeletonLoader from "./skeleton/FormSkeletonLoader.vue";

interface Props {
  config: ResourceConfig<T>;
  initialData?: Partial<T>;
  loading?: boolean;
  error?: ApiError | null;
  mode?: "create" | "edit";
  dataLoading: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  mode: "create",
  dataLoading: false,
});

const emit = defineEmits<{
  submit: [data: Partial<T>];
  cancel: [];
}>();

const resourceMap: Record<string, ResourceConfig> = {
  courses: coursesResource,
  sections: sectionsResource,
  units: unitsResource,
  lessons: lessonsResource,
  questions: questionsResource,
  badges: badgesResource,
  users: usersResource,
};

const remoteOptions = ref<Record<string, { label: string; value: any }[]>>({});

// Fetch remote options for fields that require them
const fetchRemoteOptions = async () => {
  for (const field of formFields.value) {
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

// Local validation errors
const validationErrors = ref<Record<string, string>>({});

// Initialize form data
const initializeFormData = () => {
  formFields.value.forEach((field) => {
    if (props.initialData && field.key in props.initialData) {
      const value = props.initialData[field.key];
      if (field.type === "date") {
        formData.value[field.key] = formatDateForInput(value, field.type);
      } else if (field.type === "json") {
        // Parse JSON if it's a string
        try {
          formData.value[field.key] = typeof value === "string" ? JSON.parse(value) : (value || getDefaultJsonValue(field));
        } catch (e) {
          console.error(`Invalid JSON for ${field.key}`, value);
          formData.value[field.key] = getDefaultJsonValue(field);
        }
      } else {
        formData.value[field.key] = value;
      }
    } else if (field.type === "checkbox") {
      formData.value[field.key] = false;
    } else if (field.type === "file") {
      formData.value[field.key] = null;
    } else if (field.type === "json") {
      formData.value[field.key] = getDefaultJsonValue(field);
    } else if (field.key === "criteria") {
      formData.value.criteria = {};
    } else {
      formData.value[field.key] = "";
    }
  });
};

// Get default JSON value based on field configuration
const getDefaultJsonValue = (field: any) => {
  if (field.key === "options") {
    return [];
  }
  if (field.key === "correct_answer") {
    return [];
  }
  if (field.key === "criteria") {
    return {};
  }
  return {};
};

onMounted(() => {
  fetchRemoteOptions();
  initializeFormData();
});

// Watch for initialData changes (edit mode)
watch(
  () => props.initialData,
  (newData) => {
    if (newData) {
      Object.keys(newData).forEach((key) => {
        const field = formFields.value.find(f => f.key === key);
        if (field?.type === "date") {
          formData.value[key] = formatDateForInput(newData[key], field.type);
        } else if (field?.type === "json") {
          try {
            const parsedValue = typeof newData[key] === "string"
              ? JSON.parse(newData[key] as string)
              : (newData[key] || getDefaultJsonValue(field));
            formData.value[key] = parsedValue;
          } catch (e) {
            console.error(`Invalid JSON for ${key}`, newData[key]);
            formData.value[key] = getDefaultJsonValue(field);
          }
        } else if (key === "criteria") {
          try {
            formData.value.criteria = typeof newData.criteria === "string"
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

// Watch question_type changes to reset options and correct_answer
watch(
  () => formData.value.question_type,
  (newType, oldType) => {
    if (newType !== oldType && props.mode === "create") {
      // Reset options and correct_answer when question type changes
      if (needsOptions(newType)) {
        formData.value.options = [
          { text: "", is_correct: false },
          { text: "", is_correct: false },
        ];
      } else {
        formData.value.options = [];
      }
      formData.value.correct_answer = [];
    }
  }
);

// Watch badge type changes to update criteria structure
watch(
  () => formData.value.type,
  (newType, oldType) => {
    if (props.mode === "edit") return; // Only reset criteria in create mode
    if (newType !== oldType) {
      formData.value.criteria = {}; // Reset old criteria
    }
  }
);

// Badge criteria key mapping
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

// Check if question type needs options
const needsOptions = (questionType: string) => {
  return ["mcq", "checkbox", "matching"].includes(questionType);
};

// Check if question type allows multiple correct answers
const allowsMultipleCorrect = (questionType: string) => {
  return questionType === "checkbox";
};

// Add option for questions
const addOption = () => {
  if (!formData.value.options) {
    formData.value.options = [];
  }
  formData.value.options.push({ text: "", is_correct: false });
};

// Remove option for questions
const removeOption = (index: number) => {
  if (formData.value.options && formData.value.options.length > 2) {
    formData.value.options.splice(index, 1);
  }
};

// Update correct answer based on options
const updateCorrectAnswer = () => {
  if (!formData.value.options) return;

  const questionType = formData.value.question_type;

  if (questionType === "mcq") {
    // For MCQ, only one can be correct
    const correctOption = formData.value.options.find((opt: any) => opt.is_correct);
    formData.value.correct_answer = correctOption ? [correctOption.text] : [];
  } else if (questionType === "checkbox") {
    // For checkbox, multiple can be correct
    formData.value.correct_answer = formData.value.options
      .filter((opt: any) => opt.is_correct)
      .map((opt: any) => opt.text);
  }
};

// Toggle correct answer for MCQ (only one can be selected)
const toggleCorrectMCQ = (index: number) => {
  if (formData.value.options) {
    formData.value.options.forEach((opt: any, i: number) => {
      opt.is_correct = i === index;
    });
    updateCorrectAnswer();
  }
};

// Toggle correct answer for Checkbox (multiple can be selected)
const toggleCorrectCheckbox = (index: number) => {
  if (formData.value.options && formData.value.options[index]) {
    formData.value.options[index].is_correct = !formData.value.options[index].is_correct;
    updateCorrectAnswer();
  }
};

// Validate single field
const validateField = (field: any) => {
  const value = formData.value[field.key];

  if (field.required) {
    if (field.type === "file" && !value) {
      validationErrors.value[field.key] = `${field.label} is required`;
      return false;
    }

    if (field.type === "json") {
      // Special validation for JSON fields
      if (field.key === "options" && needsOptions(formData.value.question_type)) {
        if (!value || value.length < 2) {
          validationErrors.value[field.key] = "At least 2 options are required";
          return false;
        }
        // Check if all options have text
        const hasEmptyText = value.some((opt: any) => !opt.text || opt.text.trim() === "");
        if (hasEmptyText) {
          validationErrors.value[field.key] = "All options must have text";
          return false;
        }
      }

      if (field.key === "correct_answer") {
        if (!value || value.length === 0) {
          validationErrors.value[field.key] = "At least one correct answer is required";
          return false;
        }
      }
    } else if (!value && field.type !== "file") {
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

  const dataToSubmit: Record<string, any> = { ...formData.value };

  // Remove existing file URLs if no new file uploaded
  props.config.fields.forEach((field) => {
    if (field.type === "file") {
      const value = dataToSubmit[field.key];
      if (typeof value === "string") {
        delete dataToSubmit[field.key];
      }
    }
  });

  // Convert JSON objects to strings
  props.config.fields.forEach((field) => {
    if (field.type === "json" && dataToSubmit[field.key]) {
      dataToSubmit[field.key] = JSON.stringify(dataToSubmit[field.key]);
    }
  });

  // Convert criteria object to JSON string
  if (dataToSubmit.criteria && typeof dataToSubmit.criteria === "object") {
    dataToSubmit.criteria = JSON.stringify(dataToSubmit.criteria);
  }

  console.log("Submitting data:", dataToSubmit);
  emit("submit", dataToSubmit as Partial<T>);
};

// Get error message for field
const getFieldError = (fieldKey: string) => {
  if (validationErrors.value[fieldKey]) {
    return validationErrors.value[fieldKey];
  }
  if (props.error?.errors?.[fieldKey]) {
    return props.error.errors[fieldKey][0];
  }
  return undefined;
};

const isExistingFile = (value: any) => {
  return typeof value === "string" && value.length > 0;
};

// Check if field should be shown based on conditions
const shouldShowField = (field: any) => {
  // Special handling for question options
  if (field.key === "options") {
    return needsOptions(formData.value.question_type);
  }
  return true;
};

const formatDateForInput = (dateString: any, type: string) => {
  if (!dateString) return "";
  const d = new Date(dateString);
  const iso = d.toISOString(); // 2025-12-18T15:49:00.000Z
  
  if (type === 'date') {
    return iso.split('T')[0]; // 2025-12-18
  }
  if (type === 'datetime-local') {
    return iso.slice(0, 16); // 2025-12-18T15:49
  }
  return dateString;
};
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ mode === "create" ? "Create" : "Edit" }} {{ config.singularName }}
      </h3>
    </template>

    <FormSkeletonLoader v-if="dataLoading" :field-count="formFields.length" :columns="2" :show-header="false"
      :show-actions="true" />

    <UForm v-else @submit.prevent="handleSubmit" class="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- API Error Message -->
      <UAlert v-if="error?.message" class="col-span-2" color="error" variant="soft" :title="error.message"
        :close-button="{
          icon: 'i-heroicons-x-mark-20-solid',
          color: 'red',
          variant: 'link',
        }" />

      <!-- Form Fields -->
      <div v-for="field in formFields" :key="field.key" v-show="shouldShowField(field)"
        :class="field.type === 'json' || field.type === 'textarea' ? 'col-span-2' : ''">

        <!-- Text/Email/Password/Color Input -->
        <UFormField v-if="['text', 'email', 'password', 'color'].includes(field.type)" :label="field.label"
          :required="field.required" :error="getFieldError(field.key)">
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

          <p v-if="formData[field.key]?.name" class="mt-1 text-xs text-gray-500">
            Selected: {{ formData[field.key].name }}
          </p>

          <p v-else-if="isExistingFile(formData[field.key])" class="mt-1 text-xs text-blue-500">
            Current file: {{ (formData[field.key] as string).split('/').pop() }}
          </p>
        </UFormField>

        <!-- Select -->
        <UFormField v-else-if="field.type === 'select'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <USelect class="w-full" v-model="formData[field.key]"
            :items="field.resource ? remoteOptions[field.key] : field.options || []" @blur="validateField(field)" />
        </UFormField>

        <!-- JSON Field: Question Options -->
        <UFormField v-else-if="field.type === 'json' && field.key === 'options'" :label="field.label"
          :required="field.required" :error="getFieldError(field.key)">
          <div class="space-y-3 border rounded-lg p-4 bg-gray-50 dark:bg-gray-900">
            <div class="flex justify-between items-center mb-2">
              <span class="text-sm font-medium">Answer Options</span>
              <UButton size="xs" variant="soft" @click="addOption" icon="i-heroicons-plus">
                Add Option
              </UButton>
            </div>

            <div v-for="(option, index) in formData.options" :key="index"
              class="flex gap-2 items-center bg-white dark:bg-gray-800 p-3 rounded-lg">
              <span class="text-sm font-semibold text-gray-500 w-8">{{ String.fromCharCode(65 + index) }}.</span>

              <UInput v-model="option.text" placeholder="Enter option text" class="flex-1" />

              <!-- Radio for MCQ -->
              <div v-if="formData.question_type === 'mcq'" class="flex items-center gap-2">
                <input type="radio" :name="`correct-answer-${field.key}`" :checked="option.is_correct"
                  @change="toggleCorrectMCQ(index)" class="w-4 h-4 text-primary-600 cursor-pointer" />
                <label class="text-xs text-gray-600">Correct</label>
              </div>

              <!-- Checkbox for multiple answers -->
              <div v-else-if="formData.question_type === 'checkbox'" class="flex items-center gap-2">
                <UCheckbox v-model="option.is_correct" @change="toggleCorrectCheckbox(index)" label="Correct" />
              </div>

              <UButton v-if="formData.options.length > 2" icon="i-heroicons-trash" size="xs" color="error"
                variant="ghost" @click="removeOption(index)" />
            </div>

            <p v-if="formData.correct_answer && formData.correct_answer.length > 0" class="text-xs text-green-600 mt-2">
              ✓ Correct answer(s): {{ formData.correct_answer.join(', ') }}
            </p>
          </div>
        </UFormField>

        <!-- JSON Field: Correct Answer (for non-option questions) -->
        <UFormField
          v-else-if="field.type === 'json' && field.key === 'correct_answer' && !needsOptions(formData.question_type)"
          :label="field.label" :required="field.required" :error="getFieldError(field.key)">
          <div class="space-y-2">
            <!-- For True/False -->
            <div v-if="formData.question_type === 'torf'">
              <USelect v-model="formData.correct_answer[0]" :items="[
                { label: 'True', value: 'true' },
                { label: 'False', value: 'false' }
              ]" placeholder="Select correct answer" />
            </div>

            <!-- For Fill in the Blanks -->
            <div v-else-if="formData.question_type === 'fill'">
              <UInput v-model="formData.correct_answer[0]" placeholder="Enter the correct answer" />
              <p class="text-xs text-gray-500 mt-1">Enter the word/phrase that fills the blank</p>
            </div>

            <!-- For Matching -->
            <div v-else-if="formData.question_type === 'matching'">
              <UTextarea v-model="formData.correct_answer[0]" :rows="4"
                placeholder="Enter matching pairs (e.g., A-1, B-2, C-3)" />
              <p class="text-xs text-gray-500 mt-1">Format: A-1, B-2, C-3</p>
            </div>
          </div>
        </UFormField>

        <!-- JSON Field: Badge Criteria (handled separately below) -->
        <div v-else-if="field.type === 'json' && field.key === 'criteria'">
          <!-- This is handled by the special criteria field below -->
        </div>

        <!-- Generic JSON Field (fallback) -->
        <UFormField v-else-if="field.type === 'json'" :label="field.label" :required="field.required"
          :error="getFieldError(field.key)">
          <UTextarea :model-value="JSON.stringify(formData[field.key], null, 2)" @update:model-value="(val: string) => {
            try {
              formData[field.key] = JSON.parse(val);
            } catch (e) {
              // Invalid JSON
            }
          }" :rows="6" placeholder="{}" class="font-mono text-sm" />
        </UFormField>
      </div>

      <!-- Special Criteria Field (for badges) -->
      <UFormField v-if="currentCriteriaKey"
        :label="`${currentCriteriaKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}`" required
        :error="getFieldError('criteria')">
        <UInput class="w-full" type="number" v-model.number="formData.criteria[currentCriteriaKey]"
          :placeholder="`Enter ${currentCriteriaKey.replace(/_/g, ' ')}`"
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