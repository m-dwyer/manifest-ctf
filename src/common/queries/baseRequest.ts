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
    console.log("error: ", error);
    throw new Error("Network request error");
  }

  try {
    result = await response.json();
  } catch (error) {
    console.log("error: ", error);
    throw new Error("Error with response");
  }

  return result;
};
