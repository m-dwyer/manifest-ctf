import { request } from "../queries/baseRequest";
import { ResponseWithData } from "@/common/types/ResponseWithData";

type BaseApiClientOptions = {
  url: string;
};

type ApiClientOptions =
  | {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body: any;
    } & BaseApiClientOptions;

export const apiClient = {
  get: <TResponse>({ url }: BaseApiClientOptions) => {
    return request<TResponse>({
      url,
      options: { method: "GET" },
    }) as Promise<ResponseWithData<TResponse>>;
  },

  post: <TResponse>({ url, body }: ApiClientOptions) => {
    return request<TResponse>({
      url,
      options: { method: "POST", body },
    }) as Promise<ResponseWithData<TResponse>>;
  },

  put: <TResponse>({ url, body }: ApiClientOptions) => {
    return request<TResponse>({
      url,
      options: { method: "PUT", body },
    }) as Promise<ResponseWithData<TResponse>>;
  },

  delete: <TResponse>({ url, body }: ApiClientOptions) => {
    return request<TResponse>({
      url,
      options: { method: "DELETE", body },
    }) as Promise<ResponseWithData<TResponse>>;
  },

  patch: <TResponse>({ url, body }: ApiClientOptions) => {
    request<TResponse>({
      url,
      options: { method: "PATCH", body },
    }) as Promise<ResponseWithData<TResponse>>;
  },
};
