export function useDashboardCounts() {
  const counts = ref<Record<string, number>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const { getAuthHeader } = useAdminAuth()

  const apiBase =
    useRuntimeConfig().public.apiBaseUrl ||
    "http://localhost:8000/api/admin"

  const fetchCounts = async () => {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch<Record<string, number>>(
        `${apiBase}/dashboard/counts`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...getAuthHeader(),
          },
        }
      )

      counts.value = response
    } catch (e: any) {
      error.value = e?.data?.message || "Failed to load counts"

      // auto logout on 401
      if (e?.status === 401) {
        const { logout } = useAdminAuth()
        await logout()
      }
    } finally {
      loading.value = false
    }
  }

  return {
    counts,
    loading,
    error,
    fetchCounts,
  }
}
