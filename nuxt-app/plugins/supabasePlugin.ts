import { defineNuxtPlugin } from '#app';
import { createClient } from '@supabase/supabase-js';

export default defineNuxtPlugin(() => {
  const { $config } = useNuxtApp();
  const url = $config.supabaseUrl;
  const key = $config.supabaseKey;

  return {
    provide: {
      supabase: createClient(url, key),
    },
  };
});
