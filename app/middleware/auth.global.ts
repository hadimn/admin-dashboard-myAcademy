// middleware/auth.global.ts
export default defineNuxtRouteMiddleware((to, from) => {
  // Allow guest-only routes (login, etc.) to pass
  if (to.path === '/auth/login') {
    return
  }

  const { isAuthenticated } = useAdminAuth()

  // If not authenticated, redirect to login
  if (!isAuthenticated.value) {
    return navigateTo('/auth/login')
  }
})