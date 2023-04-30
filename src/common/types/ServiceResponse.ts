export type ServiceResponse<T> = {
  error: string | null;
  data: T | null;
};
