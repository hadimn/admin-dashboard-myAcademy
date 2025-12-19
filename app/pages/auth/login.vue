<!-- pages/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: 'auth',
  middleware: ['guest']
})

const { login, loading, error } = useAdminAuth()

const form = ref({
  email: '',
  password: ''
})

const validationErrors = ref<Record<string, string>>({})

const validateForm = () => {
  validationErrors.value = {}
  let isValid = true

  if (!form.value.email) {
    validationErrors.value.email = 'Email is required'
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)) {
    validationErrors.value.email = 'Invalid email format'
    isValid = false
  }

  if (!form.value.password) {
    validationErrors.value.password = 'Password is required'
    isValid = false
  } else if (form.value.password.length < 6) {
    validationErrors.value.password = 'Password must be at least 6 characters'
    isValid = false
  }

  return isValid
}

const handleLogin = async () => {
  if (!validateForm()) {
    return
  }

  try {
    await login({
      email: form.value.email,
      password: form.value.password
    })

    // Redirect to dashboard on success
    await navigateTo('/')
  } catch (err) {
    // Error is already set in the composable
    console.error('Login failed:', err)
  }
}
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md">
      <UCard>
        <template #header>
          <div class="text-center">
            <h1 class="flex just-center items-center flex-col text-2xl font-bold text-highlighted dark:text-white">
              <ColorModeButton />
              Admin Login
            </h1>
            <p class="mt-2 text-sm text-muted dark:text-gray-400">
              Sign in to access the admin dashboard
            </p>
          </div>
        </template>

        <UForm @submit.prevent="handleLogin" class="flex justify-center items-center flex-col space-y-4">
          <!-- API Error Message -->
          <UAlert v-if="error" color="error" variant="soft" :title="error" :close-button="{
            icon: 'i-heroicons-x-mark-20-solid',
            color: 'red',
            variant: 'link'
          }" @close="error = null" />

          <!-- Email Field -->
          <UFormField label="Email" :error="validationErrors.email" required>
            <UInput v-model="form.email" type="email" placeholder="admin@example.com" icon="i-heroicons-envelope"
              size="lg" :disabled="loading" />
          </UFormField>

          <!-- Password Field -->
          <UFormField label="Password" :error="validationErrors.password" required>
            <UInput v-model="form.password" type="password" placeholder="••••••••" icon="i-heroicons-lock-closed"
              size="lg" :disabled="loading" />
          </UFormField>

          <!-- Submit Button -->
          <UButton type="submit" block size="lg" :loading="loading" :disabled="loading">
            Sign In
          </UButton>
        </UForm>
      </UCard>
    </div>
  </div>
</template>