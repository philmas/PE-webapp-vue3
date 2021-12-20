<template>
  <div class="background" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="header">
        <slot name="header" />
      </div>
      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
});
</script>

<style scoped lang="scss">
.background {
  --backdrop-color: hsl(207deg 30% 93% / 90%);

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--background-color);
  z-index: 100;
  backdrop-filter: blur(3px);
  cursor: pointer;

  & .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--width, var(--width-medium));
    min-height: 15rem;
    max-width: 90vw;
    background-color: var(--modal-background, --white-color);
    border-radius: var(--corner-radius-large);
    box-shadow: 0 0 3rem 0 var(--grey-color-400);
    cursor: default;
    padding: var(--spacing-large);

    & .header {
      display: flex;
      align-items: center;
      width: 100%;
      color: var(--primary-color-900);
      font-size: var(--subtitle);
      gap: 0.75rem;
      height: 2rem;
    }

    & .content {
      max-height: calc(90vh - 15rem);
    }
  }
}
</style>
