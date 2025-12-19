<!-- app/pages/coursePricing/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create Course Pricing'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<CoursePricing>(CoursePricingResource)

// Handle form submission
const handleSubmit = async (data: Partial<CoursePricing>) => {
  try {
    console.log(data);
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Course price created successfully',
      color: 'success'
    })
    
    // Redirect to courses pricing list
    router.push('/coursePricing')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create course price:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/coursePricing')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create Course Price
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new course price to your system
      </p>
    </div>

    <!-- Form -->
    <CrudForm
      :data-loading="false"
      :config="CoursePricingResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>