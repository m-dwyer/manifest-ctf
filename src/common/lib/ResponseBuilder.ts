import { ResponseWithData } from "@/common/dto/ResponseWithData";

type ResponseOptions<T> = { success: boolean; error?: string; data?: T };

export const buildResponse = <TResultType>(
  options: ResponseOptions<TResultType>
) => {
  return {
    success: options.success,
    error: options.error,
    data: options.data,
  } as ResponseWithData<TResultType>;
};
