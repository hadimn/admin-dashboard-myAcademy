<script setup lang="ts">
const route = useRoute();
const { admin, logout, loading } = useAdminAuth();
const { $echo } = useNuxtApp();
const notifications = useAdminNotifications();


// listen to events from laravel reverb notifications.
// and push notification using toast.add()
onMounted(() => {
  $echo.channel("admin-notifications").listen(".user.created", (event: any) => {
    console.log("EVENT RECEIVED:", event);
    notifications.userCreated(event.user);
  });
  $echo
    .channel("admin-notifications")
    .listen(".user.done.lesson", (event: any) => {
      console.log(event.message); // 🎉 John Doe has completed the lesson 'Intro to PHP' in course 'Laravel Basics'!
      notifications.userDoneLesson({
        name: event.user.name,
        lesson_title: event.lesson.title,
        course_title: event.course.title,
      });
    });
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
  <div class="min-h-screen lg:pl-72 bg-default">
    <AdminNavbar @toggle-sidebar="showSidebar = !showSidebar" />
    <main class="py-5">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped></style>
