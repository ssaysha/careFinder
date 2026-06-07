import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error("Missing VITE_SUPABASE_URL in .env file");
}

if (!supabaseAnonKey) {
  throw new Error("Missing VITE_SUPABASE_ANON_KEY in .env file");
}

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase KEY OK:", supabaseAnonKey?.slice(0, 20));

export const supabase = createClient(supabaseUrl, supabaseAnonKey);