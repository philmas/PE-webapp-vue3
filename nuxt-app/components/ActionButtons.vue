<!-- DEPRECATED -> moved to buttons/ActionButtons.vue -->

<template>
  <section
    class="actionButtons"
    :class="{ alignActionsRight: rightAlign, placementBottem: bottom }"
  >
    <slot></slot>
  </section>
</template>

<script lang="ts" setup>
defineProps({
  rightAlign: {
    type: Boolean,
    default: false,
  },
  bottom: {
    type: Boolean,
    default: false,
  },
});
</script>

<style scoped lang="scss">
.actionButtons {
  width: var(--width-large);
  margin: var(--spacing-medium) auto 0;
  max-width: 90vw;
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-small);
  margin-bottom: var(--spacing-large);

  &.alignActionsRight {
    justify-content: end;
  }

  &.placementBottem {
    margin-bottom: 5rem;
  }
}
</style>
