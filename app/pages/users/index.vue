<!-- app/pages/users/index.vue -->
<script setup lang="ts">
import { usersResource, type User } from '~/config/resources/users'

definePageMeta({
  title: 'Users Management'
})

const router = useRouter()

// Initialize CRUD composable
const crud = useCrud<User>(usersResource)

// Search state
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()

// Delete confirmation state
const deleteModal = ref(false)
const itemToDelete = ref<number | null>(null)

// Fetch items on mount
onMounted(() => {
  crud.fetchItems()
})

// Handle search with debounce
watch(searchQuery, (newValue) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }
  
  searchTimeout.value = setTimeout(() => {
    crud.fetchItems(1, newValue)
  }, 300)
})

// Handle page change
const handlePageChange = (page: number) => {
  crud.fetchItems(page, searchQuery.value)
}

// Handle view
const handleView = (id: string | number) => {
  router.push(`/users/${id}`)
}

// Handle edit
const handleEdit = (id: string | number) => {
  router.push(`/users/${id}/edit`)
}

// Handle delete
const handleDelete = (id: string | number) => {
  itemToDelete.value = Number(id)
  deleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  if (itemToDelete.value === null) return
  
  try {
    await crud.deleteItem(itemToDelete.value)
    deleteModal.value = false
    itemToDelete.value = null
    
    // Show success notification (using Nuxt UI)
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: 'User deleted successfully',
      color: 'success'
    })
    
    // Refresh list
    crud.fetchItems(crud.pagination.value.current_page, searchQuery.value)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to delete user',
      color: 'error'
    })
  }
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
          Users Management
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your users and their permissions
        </p>
      </div>
      <UButton
        icon="i-heroicons-plus"
        size="lg"
        @click="router.push('/users/create')"
      >
        Create User
      </UButton>
    </div>

    <!-- Search -->
    <UCard v-if="usersResource.searchable">
      <UInput
        v-model="searchQuery"
        icon="i-heroicons-magnifying-glass"
        placeholder="Search users..."
        size="lg"
      />
    </UCard>

    <!-- Error Alert -->
    <UAlert
      v-if="crud.error.value"
      color="error"
      variant="soft"
      :title="crud.error.value.message"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }"
    />

    <!-- Table -->
    <CrudTable
      :config="usersResource"
      :items="[...crud.items.value]"
      :loading="crud.loading.value"
      :pagination="crud.pagination.value"
      @view="handleView"
      @edit="handleEdit"
      @delete="handleDelete"
      @page-change="handlePageChange"
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