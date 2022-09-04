import { ResponseWithData } from "@/common/types/ResponseWithData";

type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type FetchOptions = {
  method: FetchMethod;
  headers: { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body: any;
};

type QueryOptions = {
  url: string;
  options?: FetchOptions;
};

export const query = async <TResultType>({ url, options }: QueryOptions) => {
  let fetchOptions = null;
  if (options) {
    fetchOptions = { ...options };
  }

  let response = null;
  try {
    response = fetchOptions ? await fetch(url, fetchOptions) : await fetch(url);
  } catch (error) {
    throw new Error("Network request error");
  }

  if (!response.ok) {
    throw new Error("Error in response");
  }

  const result: ResponseWithData<TResultType> = await response.json();

  return result;
};
