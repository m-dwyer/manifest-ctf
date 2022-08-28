import { createClient } from "@supabase/supabase-js";

const supabaseUrl: string = process.env.SUPABASE_URL || "";
const supabaseServiceKey: string = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const supabaseServiceClient = createClient(
  supabaseUrl,
  supabaseServiceKey
);
