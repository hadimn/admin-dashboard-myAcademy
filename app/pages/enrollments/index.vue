<!-- app/pages/enrollments/index.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'Enrollments Management'
})

const router = useRouter()

// Initialize CRUD composable
const crud = useCrud<Enrollments>(enrollmentsResource)

// Search state
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()

// Delete confirmation state
const deleteModal = ref(false)
const itemToDelete = ref<Enrollments | null>(null)

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
  router.push(`/enrollments/${id}`)
}

// Handle edit
const handleEdit = (id: string | number) => {
  router.push(`/enrollments/${id}/edit`)
}

// Handle delete
const handleDelete = (enrollment: Enrollments) => {
  itemToDelete.value = enrollment
  deleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  if (itemToDelete.value === null) return

  try {
    await crud.deleteItem(itemToDelete.value.enrollment_id)
    deleteModal.value = false
    itemToDelete.value = null

    // Show success notification (using Nuxt UI)
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: 'Enrollment deleted successfully',
      color: 'success'
    })

    // Refresh list
    crud.fetchItems(crud.pagination.value.current_page, searchQuery.value)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to delete enrollment',
      color: 'error'
    })
  }
}

// Cancel delete
const cancelDelete = () => {
  deleteModal.value = false
  itemToDelete.value = null
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Enrollments Management
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your enrollments and their permissions
        </p>
      </div>
      <UButton icon="i-heroicons-plus" size="lg" class="w-full sm:w-auto" @click="router.push('/enrollments/create')">
        Create enrollment
      </UButton>
    </div>


    <!-- Search -->
    <UCard v-if="enrollmentsResource.searchable">
      <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search User Progress..."
        size="lg" />
    </UCard>

    <!-- Error Alert -->
    <UAlert v-if="crud.error.value" color="error" variant="soft" :title="crud.error.value.message"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }" />

    <!-- Table -->
    <CrudsCrudTable :config="enrollmentsResource" :items="[...crud.items.value]" :loading="crud.loading.value"
      :pagination="crud.pagination.value" @view="handleView" @edit="handleEdit" @delete-item="handleDelete"
      @page-change="handlePageChange" />

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModal" title="Confirm Delete"
      description="This action cannot be undone and will permanently remove the course price from the system."
      :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="space-y-3">
          <p class="text-gray-900 dark:text-gray-100">
            Are you sure you want to delete this course price?
          </p>
          <div v-if="itemToDelete" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ itemToDelete.course_id || 'Course Price' }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton color="neutral" variant="outline" @click="cancelDelete">
          Cancel
        </UButton>
        <UButton color="error" :loading="crud.loading.value" @click="confirmDelete">
          Delete User Progress
        </UButton>
      </template>
    </UModal>
  </div>
</template>
