import { ApiUseFetch } from "../api/useApi";
import type { ApiResponse } from "~/types/apiResponse";
import type { badge } from "~/types/badge";

export const useShowBadge = (badgeId: string | string[] | undefined) => {
  const { data, pending, error, refresh } = ApiUseFetch<ApiResponse<badge>>(
    "get",
    `/badges/${badgeId}`
  );

  return {
    badge: data,
    pending,
    error,
    refetch: refresh,
  };
};
