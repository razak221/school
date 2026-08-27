import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ryhtbvczmtuyfacjqfnm.supabase.co';
const supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'sb_publishable_0jXMf-UljXH-10w0n_pFIw_U3DKDj_r';

export const supabase = createClient(supabaseUrl, supabaseKey);

export async function syncToSupabase() {
  console.log(`📡 Connecting to Supabase at ${supabaseUrl}...`);

  // 1. Organization
  const org = {
    id: 'a0000000-0000-0000-0000-000000000001',
    name: 'Govt Middle School Awanpora',
    udise_code: '01050200101',
    zone: 'Salia (Zone Mattan)',
    district: 'Anantnag',
    state: 'Jammu & Kashmir',
    school_type: 'Middle School (1st to 8th)',
    principal_name: 'Mohammad Ashraf Bhat',
    contact_phone: '+91-9419011122',
    email: 'gmsawanpora.salia@gmail.com',
    academic_year: '2026-2027',
  };

  try {
    const { error: orgError } = await supabase.from('organizations').upsert(org, { onConflict: 'udise_code' });
    if (orgError) {
      console.warn('⚠️ Organizations table not yet initialized in Supabase SQL editor:', orgError.message);
      console.log('👉 Please execute "supabase_schema.sql" in your Supabase Dashboard SQL Editor first!');
      return;
    }
    console.log('✅ Organization synced to Supabase.');
  } catch (err: any) {
    console.error('Sync error:', err?.message);
  }
}

if (require.main === module) {
  syncToSupabase();
}
