// app/composables/useCrud.ts
import type { ResourceConfig, PaginatedResponse, ApiError } from '~/types/crud'

export function useCrud<T extends Record<string, any>>(config: ResourceConfig<T>) {
  const { endpoint, idField = 'id' } = config

  // State
  const items = ref<T[]>([])
  const item = ref<T | null>(null)
  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: config.perPage || 15,
    total: 0
  })

  // API base URL from runtime config or environment
  const apiBase = useRuntimeConfig().public.apiBaseUrl || 'http://localhost:8000/api/admin'

  // Fetch all items (paginated)
  const fetchItems = async (page = 1, search = '') => {
    loading.value = true
    error.value = null
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        per_page: pagination.value.per_page.toString()
      })
      
      if (search && config.searchable) {
        params.append('search', search)
      }

      const response = await $fetch<PaginatedResponse<T>>(
        `${apiBase}/${endpoint}?${params}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      items.value = response.data
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total
      }
    } catch (e: any) {
      error.value = {
        message: e.data?.message || 'Failed to fetch items',
        errors: e.data?.errors
      }
    } finally {
      loading.value = false
    }
  }

  // Fetch single item
  const fetchItem = async (id: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: T }>(
        `${apiBase}/${endpoint}/${id}`,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      item.value = response.data
    } catch (e: any) {
      error.value = {
        message: e.data?.message || 'Failed to fetch item',
        errors: e.data?.errors
      }
    } finally {
      loading.value = false
    }
  }

  // Create item
  const createItem = async (data: Partial<T>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: T }>(
        `${apiBase}/${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: data
        }
      )

      return response.data
    } catch (e: any) {
      error.value = {
        message: e.data?.message || 'Failed to create item',
        errors: e.data?.errors
      }
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Update item
  const updateItem = async (id: string | number, data: Partial<T>) => {
    loading.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: T }>(
        `${apiBase}/${endpoint}/${id}`,
        {
          method: 'PUT',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          },
          body: data
        }
      )

      return response.data
    } catch (e: any) {
      error.value = {
        message: e.data?.message || 'Failed to update item',
        errors: e.data?.errors
      }
      throw error.value
    } finally {
      loading.value = false
    }
  }

  // Delete item
  const deleteItem = async (id: string | number) => {
    loading.value = true
    error.value = null
    
    try {
      await $fetch(
        `${apiBase}/${endpoint}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Accept': 'application/json'
          }
        }
      )

      // Remove from local state
      items.value = items.value.filter(i => i[idField] !== id)
    } catch (e: any) {
      error.value = {
        message: e.data?.message || 'Failed to delete item',
        errors: e.data?.errors
      }
      throw error.value
    } finally {
      loading.value = false
    }
  }

  return {
    // State
    items: readonly(items),
    item: readonly(item),
    loading: readonly(loading),
    error: readonly(error),
    pagination: readonly(pagination),
    
    // Methods
    fetchItems,
    fetchItem,
    createItem,
    updateItem,
    deleteItem
  }
}