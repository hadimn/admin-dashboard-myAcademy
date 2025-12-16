<script setup lang="ts">
const route = useRoute();
const { admin, logout, loading } = useAdminAuth()


useHead({
  meta: [
    { property: "og:title", content: `${route.meta.title} - admin dashboard` },
  ],
});

const showSidebar = ref(false);
</script>

<template>
  <AdminSidebar 
    :is-open="showSidebar" 
    :admin="admin" 
    :loading="loading" 
    @close="showSidebar = false"
    @logout="logout" 
  />
  <div class="min-h-screen lg:pl-72 bg-gray-50">
    <AdminNavbar @toggle-sidebar="showSidebar = !showSidebar" />
    <main class="py-5">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>
