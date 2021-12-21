<template>
  <div class="container">
    <slot />
  </div>
</template>

<style scoped>
.container {
  width: var(--width, var(--width-large));
  max-width: 90vw;
  background: var(--grey-color-000);
  border-radius: var(--corner-radius);
  margin: var(--spacing, 1rem auto);
  padding: var(--spacing, var(--spacing-small));
}
</style>
