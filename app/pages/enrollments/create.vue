<!-- app/pages/enrollments/create.vue -->
<script setup lang="ts">


definePageMeta({
  title: 'Create enrollment'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Enrollments>(enrollmentsResource)

// Handle form submission
const handleSubmit = async (data: Partial<Enrollments>) => {
  // Log the data to console
  console.log("Form data submitted:", data);

  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'enrollment created successfully',
      color: 'success'
    })
    
    // Redirect to enrollments list
    router.push('/enrollments')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create enrollments:', error)
  }
}


// Handle cancel
const handleCancel = () => {
  router.push('/enrollments')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create enrollments
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new enrollments to your system
      </p>
    </div>

    <!-- Form -->
    <CrudsCrudForm
      :config="enrollmentsResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      :data-loading="false"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>