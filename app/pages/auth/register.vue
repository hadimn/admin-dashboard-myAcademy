<script setup lang="ts">

const isLoading = ref(false);
const showPassword = ref(false);
const showCPassword = ref(false);

const formState = reactive({
  email: "",
  password: "",
  password_confirmation: "",
  remember: false,
});

const handleRegister = async () => {
  isLoading.value = true;

  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log("register", formState);

  //redirect after successful register
  isLoading.value = false;
  navigateTo("/");
};
</script>

<template>
  <div class="flex items-center justify-center">
    <!-- Background Pattern -->
    <div
      class="absolute inset-0 -z-10 bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px), linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-size-[6rem_4rem] opacity-20"
    ></div>

    <!-- Login Card -->
    <UCard class="w-full max-w-md shadow-xl">
      <!-- Header -->
      <template #header>
        <div class="text-center">
          <div
            class="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary-600 to-primary-800"
          >
            <UIcon name="i-heroicons-lock-closed" class="h-8 w-8 text-white" />
          </div>
          <h1 class="text-3xl font-bold text-gray-900">Register</h1>
          <p class="mt-2 text-gray-600">Create a new admin account!</p>
        </div>
      </template>

      <!-- Login Form -->
      <UForm
        :state="formState"
        class="space-y-6 flex justify-center flex-col items-center"
        @submit="handleRegister"
      >
        <!-- Email -->
        <UFormGroup class="" label="Email Address" name="email" required>
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
            :type="showPassword? 'text':'password'"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            size="xl"
            autocomplete="current-password"
          >
            <template #trailing>
              <button
                type="button"
                class="cursor-pointer"
                @click="showPassword = !showPassword"
              >
                <UIcon
                  :name="
                    showPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                />
              </button>
            </template>
          </UInput>
        </UFormGroup>

        <!-- confirm password -->
        <UFormGroup
          label="Confirm Password"
          name="password_confirmation"
          required
        >
          <UInput
            v-model="formState.password_confirmation"
            :type="showCPassword? 'text':'password'"
            placeholder="••••••••"
            icon="i-heroicons-lock-closed"
            size="xl"
            autocomplete="current-password"
          >
            <template #trailing>
              <button
                type="button"
                class="cursor-pointer"
                @click="showCPassword = !showCPassword"
              >
                <UIcon
                  :name="
                    showCPassword ? 'i-heroicons-eye-slash' : 'i-heroicons-eye'
                  "
                />
              </button>
            </template>
          </UInput>
        </UFormGroup>

        <!-- Submit -->
        <UButton
          type="submit"
          block
          size="lg"
          :loading="isLoading"
          class="mt-6 bg-primary-600 hover:bg-primary-700"
        >
          <span class="font-semibold">Register</span>
        </UButton>
      </UForm>
    </UCard>
  </div>
</template>

<style scoped></style>
