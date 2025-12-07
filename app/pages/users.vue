<script setup lang="ts">

const page = ref(1)

const users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', joined: '2024-01-01' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active', joined: '2024-01-02' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Moderator', status: 'inactive', joined: '2024-01-03' },
]

const columns = [
  { key: 'name', label: 'Name', id: 'name' },
  { key: 'email', label: 'Email', id: 'email' },
  { key: 'role', label: 'Role', id: 'role' },
  { key: 'status', label: 'Status', id: 'status' },
  { key: 'joined', label: 'Joined', id: 'joined' },
  { key: 'actions', label: '', id: 'actions' },
]

const getActionItems = (user: any) => [
  [{
    label: 'Edit',
    icon: 'i-heroicons-pencil',
    click: () => editUser(user)
  }, {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    click: () => deleteUser(user)
  }]
]

const editUser = (user: any) => {
  console.log('Edit user:', user)
}

const deleteUser = (user: any) => {
  console.log('Delete user:', user)
}
</script>
<!-- pages/users.vue -->
<template>
  <div>
    <div class="mb-8 flex items-center justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">Users</h1>
        <p class="mt-2 text-gray-600">Manage your user accounts and permissions</p>
      </div>
      <UButton icon="i-heroicons-plus" label="Add User" />
    </div>

    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h3 class="text-lg font-semibold text-gray-900">All Users</h3>
          <UInput placeholder="Search users..." icon="i-heroicons-magnifying-glass" />
        </div>
      </template>
      
      <UTable :rows="users" :columns="columns">
        <template #actions-data="{ row }">
          <UDropdown :items="getActionItems(row)">
            <UButton icon="i-heroicons-ellipsis-vertical" color="neutral" variant="ghost" />
          </UDropdown>
        </template>
      </UTable>
      
      <template #footer>
        <div class="flex items-center justify-between">
          <p class="text-sm text-gray-700">Showing 1 to 10 of 24 results</p>
          <UPagination v-model="page" :page-count="10" :total="24" />
        </div>
      </template>
    </UCard>
  </div>
</template>
