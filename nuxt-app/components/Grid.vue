<template>
  <div class="grid">
    <div v-if="title" class="title">{{ title }}</div>
    <div class="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
    default: '',
  },
});
</script>

<style scoped>
.grid {
  width: var(--width, 40rem);
  max-width: var(--max-width);
  margin: 2rem auto;
}
.grid .title {
  font-size: var(--header);
}
.grid .content {
  display: grid;
  grid-template-columns: repeat(var(--columns, 2), 1fr);
  grid-gap: var(--spacing-small) var(--spacing-large);
}
</style>
