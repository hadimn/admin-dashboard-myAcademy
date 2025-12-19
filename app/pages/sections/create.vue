<!-- app/pages/sections/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create Section'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Section>(sectionsResource)

// Handle form submission
const handleSubmit = async (data: Partial<Section>) => {
  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Section created successfully',
      color: 'success'
    })
    
    // Redirect to sections list
    router.push('/sections')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create section:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/sections')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create section
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new section to your system
      </p>
    </div>

    <!-- Form -->
    <CrudForm
      :data-loading="false"
      :config="sectionsResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>