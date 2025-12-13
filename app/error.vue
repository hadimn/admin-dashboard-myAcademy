<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const isDev = process.dev

const statusMessage = computed(() => {
  if (props.error.statusCode === 404) return 'Page not found'
  if (props.error.statusCode === 500) return 'Internal server error'
  if (props.error.statusCode === 403) return 'Access forbidden'
  return props.error.statusMessage || 'Something went wrong'
})

useHead({
  title: `Error ${props.error.statusCode} - ${statusMessage.value}`
})
</script>

<template>
  <div
    class="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-black text-white flex items-center justify-center px-4"
  >
    <div class="max-w-3xl w-full text-center space-y-8">
      <!-- Error Code -->
      <div class="relative">
        <h1
          class="text-[140px] md:text-[180px] font-black tracking-tight bg-gradient-to-r from-primary-400 to-blue-500 bg-clip-text text-transparent animate-pulse"
        >
          {{ error.statusCode }}
        </h1>

        <!-- Glow background -->
        <div
          class="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-r from-primary-500 to-blue-500"
        ></div>
      </div>

      <!-- Message -->
      <div class="space-y-3">
        <h2 class="text-3xl md:text-4xl font-bold">
          {{ statusMessage }}
        </h2>
        <p class="text-gray-400 max-w-xl mx-auto">
          {{ error.message }}
        </p>
      </div>

      <!-- Actions -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <UButton
          size="lg"
          color="primary"
          icon="i-heroicons-home"
          to="/"
        >
          Back to Home
        </UButton>

        <UButton
          size="lg"
          color="info"
          variant="outline"
          icon="i-heroicons-arrow-path"
          @click="navigateTo('/courses')"
        >
          Try Again
        </UButton>
      </div>

      <!-- Dev-only debug -->
      <div
        v-if="isDev && error.stack"
        class="hidden mt-10 bg-black/40 border border-white/10 rounded-xl p-5 text-left text-sm overflow-auto max-h-60"
      >
        <h3 class="font-semibold mb-2 text-red-400">
          Debug Info (Dev Mode)
        </h3>
        <pre class="whitespace-pre-wrap text-gray-400">{{ error.stack }}</pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) }
  50% { transform: translateY(-10px) }
}
</style>
