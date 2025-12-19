<!-- app/pages/units/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create Unit'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Units>(unitsResource)

// Handle form submission
const handleSubmit = async (data: Partial<Units>) => {
  try {
    console.log(data);
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Unit created successfully',
      color: 'success'
    })
    
    // Redirect to units list
    router.push('/units')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create unit:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/units')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create Unit
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new unit to your system
      </p>
    </div>

    <!-- Form -->
    <CrudForm
      :data-loading="false"
      :config="unitsResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>