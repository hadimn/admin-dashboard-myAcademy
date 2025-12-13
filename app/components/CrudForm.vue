<!-- app/components/CrudForm.vue -->
<script setup lang="ts" generic="T extends Record<string, any>">
import type { ResourceConfig, ApiError } from '~/types/crud'

interface Props {
  config: ResourceConfig<T>
  initialData?: Partial<T>
  loading?: boolean
  error?: ApiError | null
  mode?: 'create' | 'edit'
}

const props = withDefaults(defineProps<Props>(), {
  mode: 'create'
})

const emit = defineEmits<{
  submit: [data: Partial<T>]
  cancel: []
}>()

// Form fields that should show in form
const formFields = computed(() => 
  props.config.fields.filter(f => f.showInForm !== false)
)

// Form state
const formData = ref<Record<string, any>>({})

// Initialize form data
onMounted(() => {
  formFields.value.forEach(field => {
    if (props.initialData && field.key in props.initialData) {
      formData.value[field.key] = props.initialData[field.key]
    } else if (field.type === 'checkbox') {
      formData.value[field.key] = false
    } else {
      formData.value[field.key] = ''
    }
  })
})

// Watch for initialData changes (edit mode)
watch(() => props.initialData, (newData) => {
  if (newData) {
    Object.keys(newData).forEach(key => {
      formData.value[key] = newData[key]
    })
  }
}, { deep: true })

// Local validation errors
const validationErrors = ref<Record<string, string>>({})

// Validate single field
const validateField = (field: any) => {
  if (field.required && !formData.value[field.key]) {
    validationErrors.value[field.key] = `${field.label} is required`
    return false
  }
  
  if (field.validation) {
    const error = field.validation(formData.value[field.key])
    if (error) {
      validationErrors.value[field.key] = error
      return false
    }
  }
  
  delete validationErrors.value[field.key]
  return true
}

// Validate all fields
const validateForm = () => {
  validationErrors.value = {}
  let isValid = true
  
  formFields.value.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })
  
  return isValid
}

// Handle submit
const handleSubmit = () => {
  if (!validateForm()) {
    return
  }
  
  emit('submit', formData.value as Partial<T>)
}

// Get error message for field
const getFieldError = (fieldKey: string) => {
  // Check local validation errors first
  if (validationErrors.value[fieldKey]) {
    return validationErrors.value[fieldKey]
  }
  
  // Check API errors
  if (props.error?.errors?.[fieldKey]) {
    return props.error.errors[fieldKey][0]
  }
  
  return undefined
}
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">
        {{ mode === 'create' ? 'Create' : 'Edit' }} {{ config.singularName }}
      </h3>
    </template>

    <UForm @submit.prevent="handleSubmit" class="space-y-4">
      <!-- API Error Message -->
      <UAlert
        v-if="error?.message"
        color="error"
        variant="soft"
        :title="error.message"
        :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
      />

      <!-- Form Fields -->
      <div v-for="field in formFields" :key="field.key">
        <!-- Text Input -->
        <UFormField 
          v-if="field.type === 'text' || field.type === 'email' || field.type === 'password'" 
          :label="field.label"
          :required="field.required"
          :error="getFieldError(field.key)"
        >
          <UInput
            v-model="formData[field.key]"
            :type="field.type"
            :placeholder="field.label"
            @blur="validateField(field)"
          />
        </UFormField>

        <!-- Number Input -->
        <UFormField 
          v-else-if="field.type === 'number'" 
          :label="field.label"
          :required="field.required"
          :error="getFieldError(field.key)"
        >
          <UInput
            v-model.number="formData[field.key]"
            type="number"
            :placeholder="field.label"
            @blur="validateField(field)"
          />
        </UFormField>

        <!-- Textarea -->
        <UFormField 
          v-else-if="field.type === 'textarea'" 
          :label="field.label"
          :required="field.required"
          :error="getFieldError(field.key)"
        >
          <UTextarea
            v-model="formData[field.key]"
            :placeholder="field.label"
            :rows="4"
            @blur="validateField(field)"
          />
        </UFormField>

        <!-- Select -->
        <UFormField 
          v-else-if="field.type === 'select'" 
          :label="field.label"
          :required="field.required"
          :error="getFieldError(field.key)"
        >
          <USelect
            v-model="formData[field.key]"
            :options="field.options || []"
            @blur="validateField(field)"
          />
        </UFormField>

        <!-- Checkbox -->
        <UFormField 
          v-else-if="field.type === 'checkbox'" 
          :label="field.label"
          :error="getFieldError(field.key)"
        >
          <UCheckbox
            v-model="formData[field.key]"
            :label="field.label"
          />
        </UFormField>

        <!-- Date -->
        <UFormField 
          v-else-if="field.type === 'date'" 
          :label="field.label"
          :required="field.required"
          :error="getFieldError(field.key)"
        >
          <UInput
            v-model="formData[field.key]"
            type="date"
            @blur="validateField(field)"
          />
        </UFormField>
      </div>

      <!-- Form Actions -->
      <div class="flex justify-end gap-3 pt-4">
        <UButton
          type="button"
          color="neutral"
          variant="ghost"
          @click="emit('cancel')"
          :disabled="loading"
        >
          Cancel
        </UButton>
        <UButton
          type="submit"
          :loading="loading"
          :disabled="loading"
        >
          {{ mode === 'create' ? 'Create' : 'Update' }}
        </UButton>
      </div>
    </UForm>
  </UCard>
</template>