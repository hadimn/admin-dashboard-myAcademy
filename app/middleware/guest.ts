// middleware/guest.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const { isAuthenticated } = useAdminAuth()

  // If authenticated, redirect to dashboard
  if (isAuthenticated.value) {
    return navigateTo('/')
  }
})
