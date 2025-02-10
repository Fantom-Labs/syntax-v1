
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://votqbgkcwhjdekjjitcb.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZvdHFiZ2tjd2hqZGVramppdGNiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc2OTczNDUsImV4cCI6MjA1MzI3MzM0NX0.KnDrngs57Il3kabF7smB8n2ACqJWGuMt5hrFQx4zdno";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
});

