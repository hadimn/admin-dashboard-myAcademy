<!-- app/pages/courses/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create course'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Courses>(coursesResource)

// Handle form submission
const handleSubmit = async (data: Partial<Courses>) => {
  // Log the data to console
  console.log("Form data submitted:", data);

  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'course created successfully',
      color: 'success'
    })
    
    // Redirect to courses list
    router.push('/courses')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create courses:', error)
  }
}


// Handle cancel
const handleCancel = () => {
  router.push('/courses')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create courses
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new courses to your system
      </p>
    </div>

    <!-- Form -->
    <CrudForm
      :config="coursesResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>