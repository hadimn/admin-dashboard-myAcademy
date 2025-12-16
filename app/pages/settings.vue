<!-- pages/settings.vue -->
<template>
  <div>
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-gray-900">Settings</h1>
      <p class="mt-2 text-gray-600">Manage your account settings and preferences</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Settings Navigation -->
      <UCard class="lg:col-span-1">
        <nav class="space-y-1">
          <UButton
            v-for="item in settingsNav"
            :key="item.name"
            :to="item.to"
            color="neutral"
            variant="ghost"
            class="w-full justify-start"
            :class="[
              activeTab === item.id ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-50'
            ]"
            @click="activeTab = item.id"
          >
            <UIcon :name="item.icon" class="h-5 w-5" />
            {{ item.name }}
          </UButton>
        </nav>
      </UCard>

      <!-- Settings Content -->
      <UCard class="lg:col-span-2">
        <div v-if="activeTab === 'general'">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">General Settings</h3>
          <UForm :state="formState" class="space-y-6">
            <UFormField label="Site Name" name="siteName">
              <UInput v-model="formState.siteName" />
            </UFormField>
            
            <UFormField label="Site Description" name="siteDescription">
              <UTextarea v-model="formState.siteDescription" />
            </UFormField>
            
            <UFormField label="Timezone" name="timezone">
              <USelect v-model="formState.timezone" :options="timezones" />
            </UFormField>
            
            <div class="flex justify-end">
              <UButton type="submit" label="Save Changes" />
            </div>
          </UForm>
        </div>

        <div v-else-if="activeTab === 'security'">
          <h3 class="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
          <!-- Security settings content -->
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
const activeTab = ref('general')

const settingsNav = <any>[
  { id: 'general', name: 'General', icon: 'i-heroicons-cog-6-tooth' },
  { id: 'security', name: 'Security', icon: 'i-heroicons-shield-check' },
  { id: 'notifications', name: 'Notifications', icon: 'i-heroicons-bell' },
  { id: 'integrations', name: 'Integrations', icon: 'i-heroicons-puzzle-piece' },
]

const formState = reactive({
  siteName: 'AdminDash',
  siteDescription: 'A modern admin dashboard',
  timezone: 'UTC',
})

const timezones = ['UTC', 'EST', 'PST', 'CET']
</script>