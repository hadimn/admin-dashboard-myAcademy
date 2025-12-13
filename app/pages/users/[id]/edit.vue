<!-- app/pages/users/[id]/edit.vue -->
<script setup lang="ts">
import { usersResource, type User } from '~/config/resources/users'

definePageMeta({
  title: 'Edit User'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Get user ID from route
const userId = computed(() => route.params.id as string)

// Initialize CRUD composable
const crud = useCrud<User>(usersResource)

// Fetch user data on mount
onMounted(async () => {
  await crud.fetchItem(userId.value)
})

// Handle form submission
const handleSubmit = async (data: Partial<User>) => {
  try {
    await crud.updateItem(userId.value, data)

    toast.add({
      title: 'Success',
      description: 'User updated successfully',
      class: 'text-green-600'
    })

    // Redirect to user detail page
    router.push(`/users/${userId.value}`)
  } catch (err: any) {
    let errorMessage = 'An unknown error occurred.';

    // 1. Check if the error object has an 'errors' property 
    //    and that it is an object (like { fieldName: ['error1', 'error2'] })
    if (err.errors && typeof err.errors === 'object') {
      // 2. Extract all error message arrays into a single, flat array
      const allErrors = Object.values(err.errors).flat();

      // 3. Join the errors using a newline character (\n) as the separator
      if (allErrors.length > 0) {
        errorMessage = allErrors.join('\n');
      } else if (err.message) {
        // Fallback to the main error message if 'errors' is empty
        errorMessage = err.message;
      }
    } else if (err.message) {
      // Fallback to the main error message if 'errors' doesn't exist
      errorMessage = err.message;
    }

    toast.add({
      title: 'Error',
      // Pass the concatenated string to the description
      description: errorMessage,
      color: 'error', // Use a standard color name like 'danger' or 'red' if supported
      // class: 'text-red-600' // 'class' is often used for styling the toast container, not the text itself. Use 'color' prop if available.
    })

    console.error('Failed to update user:', err)
  }
}

// Handle cancel
const handleCancel = () => {
  router.push(`/users/${userId.value}`)
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        Edit User
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Update user information
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="crud.loading.value && !crud.item.value" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin w-8 h-8" />
    </div>

    <!-- Form -->
    <CrudForm v-else-if="crud.item.value" :config="usersResource" :initial-data="crud.item.value"
      :loading="crud.loading.value" :error="crud.error.value" mode="edit" @submit="handleSubmit"
      @cancel="handleCancel" />

    <!-- Error State -->
    <UAlert v-else-if="crud.error.value" color="error" variant="soft" :title="crud.error.value.message" />
  </div>
</template>