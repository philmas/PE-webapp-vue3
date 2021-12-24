<template>
  <div class="background" @click="$emit('close')">
    <div class="modal" @click.stop>
      <div class="header">
        <slot name="header"></slot>
      </div>
      <div class="content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
  },
});
defineEmits(["close"]);
</script>

<style scoped lang="scss">
.background {
  --modal-width: var(--width-medium);
  --modal-background: white;
  --modal-backdrop: hsl(207deg 30% 93% / 90%);

  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--modal-backdrop);
  z-index: 100;
  backdrop-filter: blur(3px);
  cursor: pointer;

  & .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: var(--modal-width);
    max-width: 90vw;
    background-color: var(--modal-background);
    border-radius: var(--corner-radius-large);
    cursor: default;
    padding: 32px 48px;

    display: flex;
    flex-direction: column;
    gap: 16px 0;

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
