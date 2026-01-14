<!-- app/pages/admins/create.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Create admin'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<Admins>(adminsResource)

// Handle form submission
// Handle form submission
const handleSubmit = async (data: Partial<Admins>) => {
  // Log the data to console
  console.log("Form data submitted:", data);

  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'Admin created successfully',
      color: 'success'
    })
    
    // Redirect to admins list
    router.push('/admins')
  } catch (error: any) {
    toast.add({
      title: `${error?.message}`,
      description: `${error?.errors}`,
      color: 'error'
    })
    // Error is already set in crud.error by the composable
    console.error('Failed to create admins:', error)
  }
}


// Handle cancel
const handleCancel = () => {
  router.push('/admins')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create admins
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new admins to your system
      </p>
    </div>

    <!-- Form -->
    <CrudsCrudForm
      :config="adminsResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      :data-loading="false"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>