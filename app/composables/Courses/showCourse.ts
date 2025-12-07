export const useCoursesShowCourse = (courseId: string|string[]|undefined) => {
  const {
    data: course,
    pending,
    error,
    refresh,
  } = useFetch<any>(`http://127.0.0.1:8000/api/admin/courses/${courseId}`);

  const refetch = async () => {
    return refresh();
  };

  return {course, pending, error, refetch};
}
