<script setup lang="ts">
const route = useRoute();

useHead({
  meta: [
    { property: "og:title", content: ` ${route.meta.title} - admin dashboard` },
  ],
});

const showSidebar = ref(false); // Start closed on mobile

const toggleSidebar = () => {
  showSidebar.value = !showSidebar.value;
};
</script>

<!-- layouts/default.vue -->
<template>
  <UApp>
    <div class="min-h-screen bg-gray-50">
      <AdminSidebar :is-open="showSidebar" @close="toggleSidebar" />
      <div class="min-h-screen lg:pl-72">
        <AdminNavbar @toggle-sidebar="toggleSidebar" />
        <main class="py-10">
          <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <slot />
          </div>
        </main>
      </div>
    </div>
  </UApp>
</template>

<style scoped></style>
