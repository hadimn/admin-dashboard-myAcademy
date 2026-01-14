<!-- app/pages/courses/index.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'courses Management'
})

const router = useRouter()

// Initialize CRUD composable
const crud = useCrud<Courses>(coursesResource)

// Search state
const searchQuery = ref('')
const searchTimeout = ref<NodeJS.Timeout>()

// Delete confirmation state
const deleteModal = ref(false)
const itemToDelete = ref<Courses | null>(null)

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
  router.push(`/courses/${id}`)
}

// Handle edit
const handleEdit = (id: string | number) => {
  router.push(`/courses/${id}/edit`)
}

// Handle delete
const handleDelete = (course: Courses) => {
  itemToDelete.value = course
  deleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  if (itemToDelete.value === null) return

  try {
    await crud.deleteItem(itemToDelete.value.course_id)
    deleteModal.value = false
    itemToDelete.value = null

    // Show success notification (using Nuxt UI)
    const toast = useToast()
    toast.add({
      title: 'Success',
      description: 'Course deleted successfully',
      color: 'success'
    })

    // Refresh list
    crud.fetchItems(crud.pagination.value.current_page, searchQuery.value)
  } catch (error) {
    const toast = useToast()
    toast.add({
      title: 'Error',
      description: 'Failed to delete course',
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
          courses Management
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Manage your courses and their permissions
        </p>
      </div>
      <UButton icon="i-heroicons-plus" size="lg" class="w-full sm:w-auto" @click="router.push('/courses/create')">
        Create courses
      </UButton>
    </div>

    <!-- Search -->
    <UCard v-if="coursesResource.searchable">
      <UInput v-model="searchQuery" icon="i-heroicons-magnifying-glass" placeholder="Search courses..." size="lg" />
    </UCard>

    <!-- Error Alert -->
    <UAlert v-if="crud.error.value" color="error" variant="soft" :title="crud.error.value.message"
      :close-button="{ icon: 'i-heroicons-x-mark-20-solid', color: 'red', variant: 'link' }" />

    <!-- Table -->
    <CrudsCrudTable :config="coursesResource" :items="[...crud.items.value]" :loading="crud.loading.value"
      :pagination="crud.pagination.value" @view="handleView" @edit="handleEdit" @delete-item="handleDelete"
      @page-change="handlePageChange" />

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModal" title="Confirm Delete"
      description="This action cannot be undone and will permanently remove the course from the system."
      :ui="{ footer: 'justify-end' }">
      <template #body>
        <div class="space-y-3">
          <p class="text-gray-900 dark:text-gray-100">
            Are you sure you want to delete this course?
          </p>
          <div v-if="itemToDelete" class="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <p class="text-sm font-medium text-gray-900 dark:text-gray-100">
              {{ itemToDelete.title || 'Course' }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400">
              {{ itemToDelete.title }}
            </p>
          </div>
        </div>
      </template>

      <template #footer>
        <UButton color="neutral" variant="outline" @click="cancelDelete">
          Cancel
        </UButton>
        <UButton color="error" :loading="crud.loading.value" @click="confirmDelete">
          Delete course
        </UButton>
      </template>
    </UModal>
  </div>
</template>
