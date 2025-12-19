<!-- app/pages/questions/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create question'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Questions>(questionsResource)

// Handle form submission
const handleSubmit = async (data: Partial<Questions>) => {
  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Question created successfully',
      color: 'success'
    })
    
    // Redirect to questions list
    router.push('/questions')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create question:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/questions')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create Question
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new question to your system
      </p>
    </div>

    <!-- Form -->
    <CrudForm
      :data-loading="false"
      :config="questionsResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>