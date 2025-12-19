// composables/useCrud.ts
import type { ResourceConfig, PaginatedResponse, ApiError } from "~/types/crud";

export function useCrud<T extends Record<string, any>>(
  config: ResourceConfig<T>
) {
  const { endpoint, idField = "id" } = config;
  const { getAuthHeader } = useAdminAuth();

  // State
  const items = ref<T[]>([]);
  const item = ref<T | null>(null);
  const loading = ref(false);
  const error = ref<ApiError | null>(null);
  const pagination = ref({
    current_page: 1,
    last_page: 1,
    per_page: config.perPage || 15,
    total: 0,
  });

  // API base URL from runtime config
  const apiBase =
    useRuntimeConfig().public.apiBaseUrl || "http://localhost:8000/api/admin";

  // Fetch all items (paginated)
  const fetchItems = async (page = 1, search = "") => {
    console.log("fetchItems called with page:", page, "search:", search); // Add this
    loading.value = true;
    error.value = null;

    try {
      const safePage = page ?? 1;
      const safeSearch = search ?? "";

      const params = new URLSearchParams({
        page: safePage.toString(),
        per_page: (pagination.value?.per_page ?? 15).toString(), // Safe access
      });

      if (safeSearch && config.searchable) {
        params.append("search", safeSearch);
      }

      const headers: Record<string, string> = {
        Accept: "application/json",
        ...getAuthHeader(),
      };

      const response = await $fetch<PaginatedResponse<T>>(
        `${apiBase}/${endpoint}?${params}`,
        {
          method: "GET",
          headers,
        }
      );

      items.value = response.data;
      pagination.value = {
        current_page: response.current_page,
        last_page: response.last_page,
        per_page: response.per_page,
        total: response.total,
      };
    } catch (e: any) {
      console.log("Error in fetchItems:", e); // Add this
      error.value = {
        message: e.data?.message || "Failed to fetch items",
        errors: e.data?.errors,
      };

      // Handle unauthorized
      if (e.status === 401) {
        const { logout } = useAdminAuth();
        await logout();
      }
    } finally {
      loading.value = false;
    }
  };

  // Fetch single item
  const fetchItem = async (id: string | number) => {
    loading.value = true;
    error.value = null;

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...getAuthHeader(),
      };

      const response = await $fetch<{ data: T }>(
        `${apiBase}/${endpoint}/${id}`,
        {
          method: "GET",
          headers,
        }
      );

      item.value = response.data;
    } catch (e: any) {
      error.value = {
        message: e.data?.message || "Failed to fetch item",
        errors: e.data?.errors,
      };

      if (e.status === 401) {
        const { logout } = useAdminAuth();
        await logout();
      }
    } finally {
      loading.value = false;
    }
  };

  // Create item
  const createItem = async (data: Partial<T>) => {
    loading.value = true;
    error.value = null;

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...getAuthHeader(),
      };

      let body: any;

      // Check if any value is a File
      const hasFile = Object.values(data).some((v) => v instanceof File);

      if (hasFile) {
        body = new FormData();
        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            body.append(key, value);
          } else if (value !== null && value !== undefined) {
            if (typeof value === "boolean") {
              body.append(key, value ? "1" : "0");
            } else {
              body.append(key, String(value));
            }
          }
        });
        // Do NOT set Content-Type header — fetch will automatically set multipart/form-data
      } else {
        body = data;
        headers["Content-Type"] = "application/json";
      }

      const response = await $fetch<{ data: T }>(`${apiBase}/${endpoint}`, {
        method: "POST",
        headers,
        body,
      });

      return response.data;
    } catch (e: any) {
      error.value = {
        message: e.data?.message || "Failed to create item",
        errors: e.data?.errors,
      };

      if (e.status === 401) {
        const { logout } = useAdminAuth();
        await logout();
      }

      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // Update item
  const updateItem = async (id: string | number, data: Partial<T>) => {
    loading.value = true;
    error.value = null;

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...getAuthHeader(),
      };

      let body: any;
      let method: "PUT" | "POST" = "PUT";
      const hasFile = Object.values(data).some((v) => v instanceof File);

      if (hasFile) {
        body = new FormData();
        body.append("_method", "PUT");

        Object.entries(data).forEach(([key, value]) => {
          if (value instanceof File) {
            body.append(key, value);
          } else if (value !== null && value !== undefined) {
            if (typeof value === "boolean") {
              body.append(key, value ? "1" : "0");
            } else {
              body.append(key, String(value));
            }
          }
        });

        // Use POST when sending FormData
        method = "POST";
      } else {
        body = data;
        headers["Content-Type"] = "application/json";
      }

      const response = await $fetch<{ data: T }>(
        `${apiBase}/${endpoint}/${id}`,
        {
          method,
          headers,
          body,
        }
      );

      return response.data;
    } catch (e: any) {
      error.value = {
        message: e.data?.message || "Failed to update item",
        errors: e.data?.errors,
      };

      if (e.status === 401) {
        const { logout } = useAdminAuth();
        await logout();
      }

      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // Delete item
  const deleteItem = async (id: string | number) => {
    loading.value = true;
    error.value = null;

    try {
      const headers: Record<string, string> = {
        Accept: "application/json",
        ...getAuthHeader(),
      };

      await $fetch(`${apiBase}/${endpoint}/${id}`, {
        method: "DELETE",
        headers,
      });

      // Remove from local state
      items.value = items.value.filter((i) => i[idField] !== id);
    } catch (e: any) {
      error.value = {
        message: e.data?.message || "Failed to delete item",
        errors: e.data?.errors,
      };

      if (e.status === 401) {
        const { logout } = useAdminAuth();
        await logout();
      }

      throw error.value;
    } finally {
      loading.value = false;
    }
  };

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
    deleteItem,
  };
}
