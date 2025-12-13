import type { Course } from "~/types/course";
import { ApiUseFetch } from "../api/useApi";
import type { ApiResponse } from "~/types/apiResponse";

export const useShowCourse = (courseId: string | string[] | undefined) => {
  const { data, pending, error, refresh } = ApiUseFetch<ApiResponse<Course>>(
    "get",
    `/courses/${courseId}`
  );

  return {
    course: data,
    pending,
    error,
    refetch: refresh,
  };
};
