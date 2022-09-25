import { PostgrestError } from "@supabase/supabase-js";

export type ServiceResponse<T> = {
  error: PostgrestError | null;
  data: T | null;
};
