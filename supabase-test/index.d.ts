import type { AxiosInstance } from 'axios';
import type { Ref } from 'vue';
import { SupabaseClient, User } from '@supabase/supabase-js';
import useSupabase from './composables/useSupabase';

declare module '#app' {
  interface NuxtApp {
    $httpClient: AxiosInstance;

    $confirmMessages: Ref<Message[]>;
    $addConfirmMessage: (message: Message) => void;
    $removeConfirmMessage: (message: Message) => void;
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $httpClient: AxiosInstance;

    $confirmMessages: Ref<Message[]>;
    $addConfirmMessage: (message: Message) => void;
    $removeConfirmMessage: (message: Message) => void;
  }
}

export {};
