<!-- app/pages/lessons/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create Lesson'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Lessons>(lessonsResource)

// Handle form submission
const handleSubmit = async (data: Partial<Lessons>) => {
  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Lesson created successfully',
      color: 'success'
    })
    
    // Redirect to lessons list
    router.push('/lessons')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create lesson:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/lessons')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create lesson
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new lesson to your system
      </p>
    </div>

    <!-- Form -->
    <CrudForm
      :data-loading="false"
      :config="lessonsResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>