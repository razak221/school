import { createServerClient } from "@supabase/ssr";

const getEnv = (key: string, fallback: string): string => {
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key] as string;
  }
  return fallback;
};

const supabaseUrl = getEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://ryhtbvczmtuyfacjqfnm.supabase.co');
const supabaseKey = getEnv('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY', 'sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r');

export const updateSession = async (request: any, responseObj?: any) => {
  let supabaseResponse = responseObj || {
    cookies: {
      set: () => {},
    },
  };

  const supabase = createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return request?.cookies?.getAll ? request.cookies.getAll() : [];
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            if (request?.cookies?.set) request.cookies.set(name, value);
            if (supabaseResponse?.cookies?.set) supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  await supabase.auth.getUser();

  return supabaseResponse;
};
