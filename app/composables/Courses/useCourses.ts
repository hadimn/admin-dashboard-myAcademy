// composables/useCourses.ts
import { useUrlDefault } from "~/composables/urlDefault";

export const useCourses = () => {
  const config = useRuntimeConfig();

  const apiBaseUrl = config.public.apiBaseUrl;
  console.log(config);
  const {
    data: courses,
    pending,
    error,
    refresh,
  } = useUrlDefault("GET", "/courses");

  const refetch = async () => {
    await refresh();
  };

  return { courses, pending, error, refetch };
};
