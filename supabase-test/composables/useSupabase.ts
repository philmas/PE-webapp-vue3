import { SupabaseClient } from '@supabase/supabase-js';

export default function () {
  return useNuxtApp().$supabase as SupabaseClient;
}
