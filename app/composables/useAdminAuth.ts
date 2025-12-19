// composables/useAdminAuth.ts
export interface Admin {
  id: number;
  name: string;
  email: string;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  admin: Admin;
  token: string;
}

export const useAdminAuth = () => {
  // const admin = useState<Admin | null>('admin', () => null)
  // const token = useState<string | null>('admin-token', () => null)
  const token = useCookie<string | null>("admin-token", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  const admin = useCookie<Admin | null>("admin", {
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  const loading = useState("admin-auth-loading", () => false);
  const error = useState<string | null>("admin-auth-error", () => null);

  const apiBase =
    useRuntimeConfig().public.apiBaseUrl || "http://localhost:8000/api/admin";

  const isAuthenticated = computed(() => {
    return !!(token.value && admin.value);
  });

  // Login
  const login = async (credentials: LoginCredentials) => {
    loading.value = true;
    error.value = null;

    try {
      const response = await $fetch<{ data: LoginResponse; message: string }>(
        `${apiBase}/login`,
        {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: credentials,
        }
      );

      // Store token and admin data
      token.value = response.data.token;
      admin.value = response.data.admin;

      return response.data;
    } catch (e: any) {
      error.value = e.data?.message || "Login failed";
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    loading.value = true;
    error.value = null;

    try {
      if (token.value) {
        await $fetch(`${apiBase}/logout`, {
          method: "POST",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token.value}`,
          },
        });
      }
    } catch (e: any) {
      console.error("Logout error:", e);
    } finally {
      // Clear state regardless of API call success
      token.value = null;
      admin.value = null;

      loading.value = false;

      // Redirect to login
      await navigateTo("/auth/login");
    }
  };

  // Get authorization header
  const getAuthHeader = (): Record<string, string> => {
    return token.value
      ? { Authorization: `Bearer ${token.value}` }
      : ({} as Record<string, string>);
  };

  // Inside useAdminAuth.ts
  const updateAdminData = (newData: Admin) => {
    admin.value = newData;
  };

  return {
    admin: readonly(admin),
    token: readonly(token),
    loading: readonly(loading),
    error: readonly(error),
    isAuthenticated,
    login,
    logout,
    getAuthHeader,
    updateAdminData,
  };
};
