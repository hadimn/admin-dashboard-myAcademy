export const useUrlDefault = (
  type: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
  route: string,
  params: object = {},
) => {
  const config = useRuntimeConfig();

  const apiBaseUrl = config.public.apiBaseUrl;
  console.log(config);

  const param = {
    method:type
  }

  if(type === "POST"){
    param.body = params
  }
  return useFetch<any>(`${apiBaseUrl}${route}`, param, );
};
