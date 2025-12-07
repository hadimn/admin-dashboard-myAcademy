<!-- pages/login.vue -->
<template>
  <div class="flex min-h-screen items-center justify-center p-4 relative">
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 -z-10 bg-white
      bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),
      linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]
      bg-size-[6rem_4rem] opacity-20"
    ></div>

    <!-- Login Card -->
    <UCard class="w-full max-w-md shadow-xl">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl
            bg-linear-to-br from-primary-600 to-primary-800"
          >
            <UIcon name="i-heroicons-lock-closed" class="h-8 w-8 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Sign In</h1>
          <p class="mt-2 text-gray-600">Access your admin dashboard</p>
        </div>
      </template>

      <!-- Login Form -->
      <UForm :state="formState" class="space-y-6 flex justify-center flex-col items-center" @submit="handleLogin">
        <!-- Email -->
        <UFormGroup label="Email Address" name="email" required>
          <UInput
            v-model="formState.email"
            placeholder="you@example.com"
            icon="i-heroicons-envelope"
            size="xl"
            autocomplete="email"
          />
        </UFormGroup>

        <!-- Password -->
        <UFormGroup label="Password" name="password" required>
          <UInput
            v-model="formState.password"
            type="password"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            size="xl"
            autocomplete="current-password"
          />
        </UFormGroup>

        <!-- Options -->
        <div class="flex items-center justify-between">
          <UCheckbox v-model="formState.remember" label="Remember me" />
          <NuxtLink
            to="/forgot-password"
            class="text-sm font-medium text-primary-600 hover:text-primary-500"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <!-- Submit -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          class="mt-6 bg-primary-600 hover:bg-primary-700"
        >
          <span class="font-semibold">Sign In</span>
        </UButton>
      </UForm>

      <!-- Footer -->
      <template #footer>
        <div class="text-center text-sm text-gray-600">
          <p>
            Don’t have an account?
            <NuxtLink
              to="/auth/register"
              class="font-medium text-primary-600 hover:text-primary-500"
            >
              Request access
            </NuxtLink>
          </p>
          <p class="mt-2 text-xs">
            By signing in, you agree to our
            <a class="font-medium text-primary-600 hover:text-primary-500" href="#">Terms</a>
            and
            <a class="font-medium text-primary-600 hover:text-primary-500" href="#">Privacy Policy</a>.
          </p>
        </div>
      </template>
    </UCard>

    <!-- Demo credentials (optional) -->
    <div class="fixed bottom-4 left-1/2 -translate-x-1/2">
      <UAlert
        title="Demo Credentials"
        description="Email: admin@example.com — Password: password123"
        color="primary"
        variant="soft"
        icon="i-heroicons-information-circle"
        class="max-w-sm"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "auth"
})  

const isLoading = ref(false)

const formState = reactive({
  email: '',
  password: '',
  remember: false
})

const handleLogin = async () => {
  isLoading.value = true

  // Simulate API request
  await new Promise(resolve => setTimeout(resolve, 1200))

  console.log('Login:', formState)

  // Redirect after successful login
  isLoading.value = false
  navigateTo('/')
}
</script>

<style scoped>
/* Fade animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
