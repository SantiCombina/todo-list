import {createClient} from "@supabase/supabase-js";

import {supabaseANON, supabaseURL} from "@/services/config";

export const supabase = createClient(supabaseURL, supabaseANON);
