<!-- app/pages/users/create.vue -->
<script setup lang="ts">
import { usersResource, type User } from '~/config/resources/users'

definePageMeta({
  title: 'Create User'
})

const router = useRouter()
const toast = useToast()

// Initialize CRUD composable
const crud = useCrud<User>(usersResource)

// Handle form submission
const handleSubmit = async (data: Partial<User>) => {
  try {
    await crud.createItem(data)
    
    toast.add({
      title: 'Success',
      description: 'User created successfully',
      color: 'success'
    })
    
    // Redirect to users list
    router.push('/users')
  } catch (error) {
    // Error is already set in crud.error by the composable
    console.error('Failed to create user:', error)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push('/users')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Create User
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Add a new user to your system
      </p>
    </div>

    <!-- Form -->
    <CrudsCrudForm
      :data-loading="false"
      :config="usersResource"
      :loading="crud.loading.value"
      :error="crud.error.value"
      mode="create"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />
  </div>
</template>