<!-- app/pages/badges/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create badge'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Badges>(badgesResource)

// Handle form submission
// Handle form submission
const handleSubmit = async (data: Partial<Badges>) => {
  // Log the data to console
  console.log("Form data submitted:", data);

  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Badge created successfully',
      color: 'success'
    })
    
    // Redirect to badges list
    router.push('/badges')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create badge:', error)
  }
}


// Handle cancel
const handleCancel = () => {
  router.push('/badges')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create badges
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new badges to your system
      </p>
    </div>

    <!-- Form -->
    <CrudsCrudForm
      :config="badgesResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      :data-loading="false"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>