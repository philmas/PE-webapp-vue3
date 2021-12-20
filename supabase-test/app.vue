<template>
  <div>{{ user }}</div>
</template>

<script setup lang="ts">
const supabase = useSupabase();
const user = useUser();

console.log({ user });
console.log({ supabase });
</script>
