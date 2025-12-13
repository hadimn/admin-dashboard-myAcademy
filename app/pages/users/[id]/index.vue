<!-- app/pages/users/[id]/index.vue -->
<script setup lang="ts">
import { usersResource, type User } from '~/config/resources/users'

definePageMeta({
  title: 'User Details'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Get user ID from route
const userId = computed(() => route.params.id as string)

// Initialize CRUD composable
const crud = useCrud<User>(usersResource)

// Delete confirmation state
const deleteModal = ref(false)

// Fetch user data on mount
onMounted(async () => {
  await crud.fetchItem(userId.value)
})

// Handle edit
const handleEdit = () => {
  router.push(`/users/${userId.value}/edit`)
}

// Handle delete
const handleDelete = () => {
  deleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  try {
    await crud.deleteItem(userId.value)
    
    toast.add({
      title: 'Success',
      description: 'User deleted successfully',
      color: 'success'
    })
    
    // Redirect to users list
    router.push('/users')
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete user',
      color: 'error'
    })
    deleteModal.value = false
  }
}

// Handle back
const handleBack = () => {
  router.push('/users')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        User Details
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        View user information
      </p>
    </div>

    <!-- Error Alert -->
    <UAlert
      v-if="crud.error.value"
      color="error"
      variant="soft"
      :title="crud.error.value.message"
    />

    <!-- Detail Card -->
    <CrudDetail
      :config="usersResource"
      :item="crud.item.value"
      :loading="crud.loading.value"
      @edit="handleEdit"
      @delete="handleDelete"
      @back="handleBack"
    />

    <!-- Delete Confirmation Modal -->
    <UModal v-model="deleteModal">
      <UCard>
        <template #header>
          <h3 class="text-lg font-semibold">Confirm Delete</h3>
        </template>

        <p class="text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this user? This action cannot be undone.
        </p>

        <template #footer>
          <div class="flex justify-end gap-3">
            <UButton
              color="neutral"
              variant="ghost"
              @click="deleteModal = false"
            >
              Cancel
            </UButton>
            <UButton
              color="error"
              :loading="crud.loading.value"
              @click="confirmDelete"
            >
              Delete
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>