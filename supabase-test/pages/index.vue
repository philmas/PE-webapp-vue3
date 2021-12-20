<template>
  <div>USER: {{ user }}</div>
</template>

<script setup lang="ts">
const user = useUser();
const auth = useAuth();
console.log(auth.user());
</script>
