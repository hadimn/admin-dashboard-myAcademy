// composables/useCourses.ts
import type { ApiResponse } from '~/types/apiResponse'
import { useApi } from '../api/useApi'
import type { Course } from '~/types/course'

export const useAllCourses = () => {
  const { data, pending, error, refresh } =
    useApi<ApiResponse<Course[]>>('get', '/courses')

  return {
    courses: data,
    pending,
    error,
    refetch: refresh,
  }
}