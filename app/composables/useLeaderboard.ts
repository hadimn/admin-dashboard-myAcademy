import type { LeaderboardResponse, LeaderboardUser } from '~/types/leaderboard'

export const useLeaderboard = () => {
  const { getAuthHeader } = useAdminAuth()
  const loading = ref(false)
  const error = ref<string | null>(null)

  const apiBase = useRuntimeConfig().public.apiBaseUrl || 'http://localhost:8000/api/admin'

  // Fetch top 10 users
  const fetchTopUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const headers = {
        Accept: 'application/json',
        ...getAuthHeader()
      }

      const response = await $fetch<LeaderboardResponse>(
        `${apiBase}/leaderboard/topusers`,
        {
          method: 'GET',
          headers
        }
      )

      return response.data
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to fetch leaderboard data'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Fetch all users
  const fetchAllUsers = async () => {
    loading.value = true
    error.value = null

    try {
      const headers = {
        Accept: 'application/json',
        ...getAuthHeader()
      }

      const response = await $fetch<LeaderboardResponse>(
        `${apiBase}/leaderboard/all`,
        {
          method: 'GET',
          headers
        }
      )

      return response.data
    } catch (e: any) {
      error.value = e.data?.message || 'Failed to fetch leaderboard data'
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fetchTopUsers,
    fetchAllUsers
  }
}