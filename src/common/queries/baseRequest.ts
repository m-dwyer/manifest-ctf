import { ResponseWithData } from "@/common/types/ResponseWithData";

type FetchMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type FetchOptions = {
  method: FetchMethod;
  headers: { [key: string]: string };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any;
};

type QueryOptions = {
  url: string;
  options?: {
    method: FetchMethod;
    headers?: { [key: string]: string };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    body?: any;
  };
};

const defaultOptions = {
  method: "GET",
  headers: {
    "Content-Type": "application/json",
  },
};

export const request = async <TResultType>({ url, options }: QueryOptions) => {
  let fetchOptions: FetchOptions | null = null;
  if (options) {
    fetchOptions = {
      ...defaultOptions,
      ...options,
    };
  }

  let response = null;
  let result: ResponseWithData<TResultType> | null = null;
  try {
    response = fetchOptions ? await fetch(url, fetchOptions) : await fetch(url);
  } catch (error) {
    throw new Error("Network request error");
  }

  try {
    result = await response.json();
  } catch (error) {
    throw new Error("Error with response");
  }

  if (!response.ok) {
    if (result) {
      throw new Error(result.error || "Unknown error");
    } else {
      throw new Error("Unknown error occurred");
    }
  }

  return result;
};
