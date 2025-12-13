import type { ApiResponse } from "~/types/apiResponse";
import type { Course } from "~/types/course";

export const useCoursesDelete = async (courseId: string | string[] | undefined) => {
    const response = await apiFetch<ApiResponse<Course>>(
      "delete",
      `/courses/${courseId}`
    );
  
    return response;
}
