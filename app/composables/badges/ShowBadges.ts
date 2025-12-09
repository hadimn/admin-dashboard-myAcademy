import type { ApiResponse } from "~/types/apiResponse";
import { useApi } from "../api/useApi";
import type { badge } from "~/types/badge";

export const useShowBadges = () => {
  const { data, pending, error, refresh } = useApi<ApiResponse<badge>>("get", "/badges");

  return {
    badges: data,
    pending,
    error,
    refetch: refresh,
  };
};
