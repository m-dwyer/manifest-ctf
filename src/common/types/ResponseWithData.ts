export type ResponseWithData<T> = {
  success: boolean;
  error?: string;
  data?: T;
};
