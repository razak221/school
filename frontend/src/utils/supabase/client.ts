import { createClient } from "@supabase/supabase-js";

const getEnv = (key: string, fallback: string): string => {
  if (typeof import.meta !== 'undefined' && (import.meta as any).env && (import.meta as any).env[key]) {
    return (import.meta as any).env[key];
  }
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL', getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://ryhtbvczmtuyfacjqfnm.supabase.co'));
const supabaseKey = getEnv('VITE_SUPABASE_ANON_KEY', getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r'));

export const supabase = createClient(supabaseUrl, supabaseKey);
