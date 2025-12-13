import type { ApiResponse } from "~/types/apiResponse";
import type { badge } from "~/types/badge";

export const useBadgesDelete = async (badgeId: string | string[] | undefined) => {
    const response = await apiFetch<ApiResponse<badge>>(
      "delete",
      `/badges/${badgeId}`
    );
  
    return response;
}
