<script lang="ts" setup>
import type { RefSymbol } from '@vue/reactivity';


const { locale, locales } = useI18n();

// Compute the direction based on current locale
const dir = computed(() => (locale.value === 'ar' ? 'rtl' : 'ltr'));

// Update the dir attribute on the <html> tag
useHead({
  htmlAttrs: {
    dir: dir,
  },
});

const toaster = { position: 'top-right' } as const;
</script>

<template>
  <UApp :toaster="toaster" class="min-h-screen bg-gray-300">
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<style>
.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: all 0.2s;
}

.slide-left-enter-from {
  opacity: 0;
  transform: translate(50px, 0);
}

.slide-left-leave-to {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-enter-from {
  opacity: 0;
  transform: translate(-50px, 0);
}

.slide-right-leave-to {
  opacity: 0;
  transform: translate(50px, 0);
}
</style>
