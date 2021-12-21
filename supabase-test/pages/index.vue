<template>
  <div>USER: {{ user.user_metadata }} <br /><br /></div>
</template>

<script setup lang="ts">
const user = useUser();
const auth = useAuth();
</script>
