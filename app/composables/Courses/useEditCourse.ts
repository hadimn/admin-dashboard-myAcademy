import type { ApiResponse } from "~/types/apiResponse";
import { useApi } from "../api/useApi";
import type { Course } from "~/types/course";

export const useCoursesUseEditCourse = (courseId: string | string[] | undefined) => {
      const { data, pending, error, refresh } = useApi<ApiResponse<Course>>("put", `/courses/${courseId}`);
    
      return {
        course: data,
        pending,
        error,
        refetch: refresh,
      };
};
