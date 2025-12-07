export default defineNuxtRouteMiddleware((to, from) => {
  const isAuthinticated = true;
  if (!isAuthinticated) {
    return navigateTo("/auth/login");
  }
});
