import { createClient } from "@supabase/supabase-js";
import { supabase_url, anon_key } from "../../config";

export const supabase = createClient(supabase_url, anon_key)