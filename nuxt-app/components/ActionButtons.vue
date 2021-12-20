<template>
  <section
    class="actionButtons"
    :class="{ alignActionsRight: rightAlign, placementBottem: bottom }"
  >
    <slot />
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
  // width: var(--width-large);
  // margin: 1rem auto 0;
  margin-left: auto;
  max-width: 90vw;
  display: flex;
  flex-wrap: wrap;
  gap: var(--margin-small);

  &.alignActionsRight {
    justify-content: end;
  }

  &.placementBottem {
    margin-bottom: 5rem;
  }
}
</style>
