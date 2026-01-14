// composables/useDashboardAnalytics.ts

export interface DashboardStats {
  total_users: number;
  total_courses: number;
  total_enrollments: number;
  total_revenue: number;
  active_users_today: number;
  completed_courses: number;
  pending_payments: number;
  total_badges_earned: number;
}

export interface RevenueData {
  date: string;
  amount: number;
  enrollments: number;
}

export interface TopCourse {
  course_id: number;
  title: string;
  enrollments: number;
  revenue: number;
  completion_rate: number;
}

export interface RecentEnrollment {
  enrollment_id: number;
  user_name: string;
  course_title: string;
  amount_paid: number;
  payment_status: string;
  enrolled_at: string;
}

export interface UserGrowth {
  date: string;
  new_users: number;
  total_users: number;
}

export const useDashboardAnalytics = () => {
  const stats = ref<DashboardStats | null>(null);
  const revenueData = ref<RevenueData[]>([]);
  const topCourses = ref<TopCourse[]>([]);
  const recentEnrollments = ref<RecentEnrollment[]>([]);
  const userGrowth = ref<UserGrowth[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const { getAuthHeader } = useAdminAuth();
  const apiBase =
    useRuntimeConfig().public.apiBaseUrl || "http://localhost:8000/api/admin";

  // Fetch all dashboard data
  const fetchDashboardData = async (
    period: "day" | "week" | "month" | "year" = "month"
  ) => {
    loading.value = true;
    error.value = null;

    try {
      // Fetch basic stats
      await fetchStats();

      // Fetch analytics data based on period
      await Promise.all([
        fetchRevenueData(period),
        fetchTopCourses(period),
        fetchRecentEnrollments(),
        fetchUserGrowth(period),
      ]);
    } catch (e: any) {
      error.value = e?.message || "Failed to load dashboard data";

      if (e?.status === 401) {
        const { logout } = useAdminAuth();
        await logout();
      }
    } finally {
      loading.value = false;
    }
  };

  // Fetch basic statistics
  const fetchStats = async () => {
    try {
      const response = await $fetch<any>(`${apiBase}/dashboard/stats`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          ...getAuthHeader(),
        },
      });

      stats.value = response.data || response;
    } catch (e: any) {
      console.error("Failed to fetch stats:", e);
      throw e;
    }
  };

  // Fetch revenue data for charts
  const fetchRevenueData = async (period: string) => {
    try {
      const response = await $fetch<any>(
        `${apiBase}/dashboard/revenue?period=${period}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...getAuthHeader(),
          },
        }
      );

      revenueData.value = response.data || response;
    } catch (e: any) {
      console.error("Failed to fetch revenue data:", e);
      throw e;
    }
  };

  // Fetch top performing courses
  const fetchTopCourses = async (period: string) => {
    try {
      const response = await $fetch<any>(
        `${apiBase}/dashboard/top-courses?period=${period}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...getAuthHeader(),
          },
        }
      );

      topCourses.value = response.data || response;
    } catch (e: any) {
      console.error("Failed to fetch top courses:", e);
      throw e;
    }
  };

  // Fetch recent enrollments
  const fetchRecentEnrollments = async () => {
    try {
      const response = await $fetch<any>(
        `${apiBase}/dashboard/recent-enrollments?limit=10`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...getAuthHeader(),
          },
        }
      );

      recentEnrollments.value = response.data || response;
    } catch (e: any) {
      console.error("Failed to fetch recent enrollments:", e);
      throw e;
    }
  };

  // Fetch user growth data
  const fetchUserGrowth = async (period: string) => {
    try {
      const response = await $fetch<any>(
        `${apiBase}/dashboard/user-growth?period=${period}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            ...getAuthHeader(),
          },
        }
      );

      userGrowth.value = response.data || response;
    } catch (e: any) {
      console.error("Failed to fetch user growth:", e);
      throw e;
    }
  };

  // Computed properties for formatted data
  const totalRevenue = computed(() => {
    const value = Number(stats.value?.total_revenue ?? 0);
    return `$${value.toFixed(2)}`;
  });

  const revenueGrowth = computed(() => {
    if (revenueData.value.length < 2) return "0%";

    const latest = revenueData.value[revenueData.value.length - 1]?.amount || 0;
    const previous =
      revenueData.value[revenueData.value.length - 2]?.amount || 0;

    if (previous === 0) return "100%";

    const growth = ((latest - previous) / previous) * 100;
    return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
  });

  const userGrowthPercentage = computed(() => {
    if (userGrowth.value.length < 2) return "0%";

    const latest =
      userGrowth.value[userGrowth.value.length - 1]?.new_users || 0;
    const previous =
      userGrowth.value[userGrowth.value.length - 2]?.new_users || 0;

    if (previous === 0) return "100%";

    const growth = ((latest - previous) / previous) * 100;
    return `${growth > 0 ? "+" : ""}${growth.toFixed(1)}%`;
  });

  return {
    stats: readonly(stats),
    revenueData: readonly(revenueData),
    topCourses: readonly(topCourses),
    recentEnrollments: readonly(recentEnrollments),
    userGrowth: readonly(userGrowth),
    loading: readonly(loading),
    error: readonly(error),
    totalRevenue,
    revenueGrowth,
    userGrowthPercentage,
    fetchDashboardData,
    fetchStats,
    fetchRevenueData,
    fetchTopCourses,
    fetchRecentEnrollments,
    fetchUserGrowth,
  };
};
