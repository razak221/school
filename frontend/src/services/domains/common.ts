import { supabase } from '../../utils/supabase/client';
import { DEFAULT_CLASSES } from '../../constants';

export const ORG_ID = 'a0000000-0000-0000-0000-000000000001';

export const normalizeClassId = (id?: string): string => {
  if (!id) return 'c0000000-0000-0000-0000-000000000001';
  const match = id.match(/^c(\d+)$/i);
  if (match) {
    const num = match[1];
    return `c0000000-0000-0000-0000-${num.padStart(12, '0')}`;
  }
  return id;
};

export const safeBtoa = (str: string): string => {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (_, p1) => String.fromCharCode(parseInt(p1, 16))));
  } catch {
    return btoa(str);
  }
};

export const safeAtob = (str: string): string => {
  try {
    return decodeURIComponent(Array.prototype.map.call(atob(str), (c: string) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
  } catch {
    return atob(str);
  }
};

export { supabase, DEFAULT_CLASSES };
