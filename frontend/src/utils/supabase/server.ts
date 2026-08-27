import { createServerClient } from "@supabase/ssr";

const getEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://ryhtbvczmtuyfacjqfnm.supabase.co');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r');

export const createClient = (cookieStore?: any) => {
  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore?.getAll ? cookieStore.getAll() : [];
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore?.set ? cookieStore.set(name, value, options) : null
            );
          } catch {
            // Ignored if in server component with middleware session refresh
          }
        },
      },
    },
  );
};
