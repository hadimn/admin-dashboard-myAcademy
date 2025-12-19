<script setup lang="ts">
const { admin, getAuthHeader } = useAdminAuth()
const apiBase = useRuntimeConfig().public.apiBaseUrl || 'http://localhost:8000/api/admin'

// Tabs
const activeTab = ref<'profile' | 'password'>('profile')

// Profile form state
const profileForm = reactive({
  name: admin.value?.name || '',
  email: admin.value?.email || '',
})

const profileLoading = ref(false)
const profileError = ref<string | null>(null)
const profileSuccess = ref<string | null>(null)

// Password form state
const passwordForm = reactive({
  old_password: '',
  password: '',
  password_confirmation: '',
})

const passwordLoading = ref(false)
const passwordError = ref<string | null>(null)
const passwordSuccess = ref<string | null>(null)

// Validation states
const profileErrors = reactive({
  name: '',
  email: '',
})

const passwordErrors = reactive({
  old_password: '',
  password: '',
  password_confirmation: '',
})

// Watch admin changes
watch(() => admin.value, (newAdmin) => {
  if (newAdmin) {
    profileForm.name = newAdmin.name
    profileForm.email = newAdmin.email
  }
}, { immediate: true })

// Validate profile form
const validateProfileForm = () => {
  let isValid = true
  profileErrors.name = ''
  profileErrors.email = ''

  if (!profileForm.name.trim()) {
    profileErrors.name = 'Name is required'
    isValid = false
  }

  if (!profileForm.email.trim()) {
    profileErrors.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileForm.email)) {
    profileErrors.email = 'Invalid email format'
    isValid = false
  }

  return isValid
}

// Validate password form
const validatePasswordForm = () => {
  let isValid = true
  passwordErrors.old_password = ''
  passwordErrors.password = ''
  passwordErrors.password_confirmation = ''

  if (!passwordForm.old_password) {
    passwordErrors.old_password = 'Current password is required'
    isValid = false
  }

  if (!passwordForm.password) {
    passwordErrors.password = 'New password is required'
    isValid = false
  } else if (passwordForm.password.length < 8) {
    passwordErrors.password = 'Password must be at least 8 characters'
    isValid = false
  }

  if (!passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Password confirmation is required'
    isValid = false
  } else if (passwordForm.password !== passwordForm.password_confirmation) {
    passwordErrors.password_confirmation = 'Passwords do not match'
    isValid = false
  }

  return isValid
}

// Update profile
const updateProfile = async () => {
  profileError.value = null
  profileSuccess.value = null

  if (!validateProfileForm()) return

  profileLoading.value = true

  try {
    const response = await $fetch<{ data: { admin: any }; message: string }>(
      `${apiBase}/update/profile`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: {
          name: profileForm.name,
          email: profileForm.email,
        }
      }
    )

    // Update admin cookie
    const adminCookie = useCookie('admin', {
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    })
    adminCookie.value = response.data.admin

    profileSuccess.value = response.message || 'Profile updated successfully'

    // Clear success message after 3 seconds
    setTimeout(() => {
      profileSuccess.value = null
    }, 3000)
  } catch (e: any) {
    profileError.value = e.data?.message || 'Failed to update profile'
  } finally {
    profileLoading.value = false
  }
}

// Change password
const changePassword = async () => {
  passwordError.value = null
  passwordSuccess.value = null

  if (!validatePasswordForm()) return

  passwordLoading.value = true

  try {
    const response = await $fetch<{ message: string }>(
      `${apiBase}/change/password`,
      {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: {
          old_password: passwordForm.old_password,
          password: passwordForm.password,
          password_confirmation: passwordForm.password_confirmation,
        }
      }
    )

    passwordSuccess.value = response.message || 'Password changed successfully'

    // Reset form
    passwordForm.old_password = ''
    passwordForm.password = ''
    passwordForm.password_confirmation = ''

    // Clear success message after 3 seconds
    setTimeout(() => {
      passwordSuccess.value = null
    }, 3000)
  } catch (e: any) {
    passwordError.value = e.data?.message || 'Failed to change password'
    console.log(e)
  } finally {
    passwordLoading.value = false
  }
}

// Reset profile form
const resetProfileForm = () => {
  if (admin.value) {
    profileForm.name = admin.value.name
    profileForm.email = admin.value.email
  }
  profileErrors.name = ''
  profileErrors.email = ''
  profileError.value = null
  profileSuccess.value = null
}
</script>

<template>
  <div>
    <!-- Page Header -->
    <div class="mb-8">
      <h1 class="text-3xl font-bold text-highlighted">Profile</h1>
      <p class="mt-2 text-muted">Manage your account information and security</p>
    </div>

    <div class="grid gap-6 lg:grid-cols-3">
      <!-- Profile Info Card -->
      <UCard class="lg:col-span-1">
        <div class="flex flex-col items-center text-center space-y-4">
          <UAvatar :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.name || 'Admin'}`"
            :alt="admin?.name || 'Admin'" size="3xl" />
          <div>
            <h3 class="text-lg font-semibold text-highlighted">{{ admin?.name }}</h3>
            <p class="text-sm text-muted">{{ admin?.email }}</p>
          </div>
          <div class="w-full pt-4 border-t border-default space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-muted">Member since</span>
              <span class="text-default">{{ new Date(admin?.created_at || '').toLocaleDateString() }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-muted">Last updated</span>
              <span class="text-default">{{ new Date(admin?.updated_at || '').toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </UCard>

      <!-- Settings Tabs -->
      <UCard class="lg:col-span-2">
        <!-- Tab Navigation -->
        <div class="flex gap-2 border-b border-default pb-4 mb-6">
          <UButton label="Profile Information" :variant="activeTab === 'profile' ? 'solid' : 'ghost'"
            :color="activeTab === 'profile' ? 'primary' : 'neutral'" @click="activeTab = 'profile'" />
          <UButton label="Change Password" :variant="activeTab === 'password' ? 'solid' : 'ghost'"
            :color="activeTab === 'password' ? 'primary' : 'neutral'" @click="activeTab = 'password'" />
        </div>

        <!-- Profile Tab -->
        <div v-if="activeTab === 'profile'">
          <h3 class="text-lg font-semibold text-highlighted mb-4">Update Profile Information</h3>

          <!-- Success Alert -->
          <UAlert v-if="profileSuccess" color="success" variant="soft" :title="profileSuccess" class="mb-4" close
            @update:open="(value) => { if (!value) profileSuccess = null }" />

          <!-- Error Alert -->
          <UAlert v-if="profileError" color="error" variant="soft" :title="profileError" class="mb-4" close
            @update:open="(value) => { if (!value) profileError = null }" />

          <form @submit.prevent="updateProfile" class="space-y-4">
            <UFormField label="Name" name="name" :error="profileErrors.name">
              <UInput v-model="profileForm.name" placeholder="Enter your name" />
            </UFormField>

            <UFormField label="Email" name="email" :error="profileErrors.email">
              <UInput v-model="profileForm.email" type="email" placeholder="Enter your email" />
            </UFormField>

            <div class="flex gap-3 pt-2">
              <UButton type="submit" label="Save Changes" :loading="profileLoading" :disabled="profileLoading" />
              <UButton type="button" label="Reset" variant="outline" color="neutral" @click="resetProfileForm"
                :disabled="profileLoading" />
            </div>
          </form>
        </div>

        <!-- Password Tab -->
        <div v-else-if="activeTab === 'password'">
          <h3 class="text-lg font-semibold text-highlighted mb-4">Change Password</h3>

          <!-- Success Alert -->
          <UAlert v-if="passwordSuccess" color="success" variant="soft" :title="passwordSuccess" class="mb-4" close
            @update:open="(value) => { if (!value) passwordSuccess = null }" />

          <!-- Error Alert -->
          <UAlert v-if="passwordError" color="error" variant="soft" :title="passwordError" class="mb-4" close
            @update:open="(value) => { if (!value) passwordError = null }" />

          <form @submit.prevent="changePassword" class="space-y-4">
            <UFormField label="Current Password" name="old_password" :error="passwordErrors.old_password">
              <UInput v-model="passwordForm.old_password" type="password" placeholder="Enter your current password" />
            </UFormField>

            <UFormField label="New Password" name="password" :error="passwordErrors.password"
              help="Must be at least 8 characters">
              <UInput v-model="passwordForm.password" type="password" placeholder="Enter your new password" />
            </UFormField>

            <UFormField label="Confirm New Password" name="password_confirmation"
              :error="passwordErrors.password_confirmation">
              <UInput v-model="passwordForm.password_confirmation" type="password"
                placeholder="Confirm your new password" />
            </UFormField>

            <div class="pt-2">
              <UButton type="submit" label="Change Password" :loading="passwordLoading" :disabled="passwordLoading" />
            </div>
          </form>
        </div>
      </UCard>
    </div>
  </div>
</template>
