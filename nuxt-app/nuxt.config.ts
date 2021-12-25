import { defineNuxtConfig } from "nuxt3";

// https://v3.nuxtjs.org/docs/directory-structure/nuxt.config
export default defineNuxtConfig({
  build: {
    transpile: ["@popperjs"],
  },
  css: ["~/assets/css/fonts.scss", "~/assets/css/styles.scss"], // CSS init file
  meta: {
    link: [
      {
        href: "https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined",
        rel: "stylesheet",
      },
    ],
  },
  vue: {
    compilerOptions: {
      // Define ion-icon as custom tag
      isCustomElement: (tag: string) => ["ion-icon"].includes(tag),
    },
  },
  publicRuntimeConfig: {
    // Expose env to supabase
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },
});
