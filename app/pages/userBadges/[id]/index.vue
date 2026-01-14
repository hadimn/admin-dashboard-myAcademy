<!-- app/pages/userBadges/[id]/index.vue -->
<script setup lang="ts">

definePageMeta({
  title: 'User badges Details'
})

const route = useRoute()
const router = useRouter()
const toast = useToast()

// Get user badges ID from route
const userBadgesId = computed(() => route.params.id as string)

// Initialize CRUD composable
const crud = useCrud<UserBadges>(userBadgesResource)

// Delete confirmation state
const deleteModal = ref(false)

// Fetch user badges data on mount
onMounted(async () => {
  await crud.fetchItem(userBadgesId.value)
})

// Handle edit
const handleEdit = () => {
  router.push(`/userBadges/${userBadgesId.value}/edit`)
}

// Handle delete
const handleDelete = () => {
  deleteModal.value = true
}

// Confirm delete
const confirmDelete = async () => {
  try {
    await crud.deleteItem(userBadgesId.value)
    
    toast.add({
      title: 'Success',
      description: 'User badge deleted successfully',
      color: 'success'
    })
    
    // Redirect to users progress list
    router.push('/userBadges')
  } catch (error) {
    toast.add({
      title: 'Error',
      description: 'Failed to delete user badge',
      color: 'error'
    })
    deleteModal.value = false
  }
}

// Handle back
const handleBack = () => {
  router.push('/userBadges')
}
</script>

<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
        User badge Details
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        View user badge information
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
    <CrudsCrudDetail
      :config="userBadgesResource"
      :item="crud.item.value"
      :loading="crud.loading.value"
      :edit="false"
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
          Are you sure you want to delete this user badge? This action cannot be undone.
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