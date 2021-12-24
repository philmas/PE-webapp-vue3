<template>
  <button
    @click.self="$emit('click')"
    :class="classes"
    :disabled="disabled || loading"
    :data-tooltip="tooltip"
  >
    <div v-if="loading">
      <i v-if="icon" class="material-icons">hourglass_empty</i>
      Loading...
    </div>
    <div v-else>
      <i v-if="icon" class="material-icons-outlined">{{ icon }}</i>
      <slot />
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, PropType } from "vue";

type ButtonState =
  | "default"
  | "primary"
  | "secondary"
  | "disabled"
  | "destructive";

const props = defineProps({
  icon: {
    type: String,
    default: "",
  },
  state: {
    type: String as PropType<ButtonState>,
    default: "default",
  },
  size: {
    type: String as PropType<"tiny" | "small" | "medium" | "large">,
    default: "medium",
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  disabled: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  tooltip: String as PropType<string>,
});

const classes = computed(() => {
  const classObj: { [key: string]: boolean } = {};
  classObj["button"] = true;
  classObj["disabled"] = !!props.disabled || !!props.loading;
  classObj["size-" + props.size] = !!props.size;
  classObj["state-" + props.state] = !!props.state;
  classObj["hasTooltip"] = !!props.tooltip;
  return classObj;
});
</script>

<style lang="scss">
.button {
  --color: var(--white-color);
  --background-color: var(--grey-color-900);
  position: relative;
  all: unset;
  min-width: 20rem;
  max-width: 90vw;
  color: var(--white-color);
  background: var(--background-color);
  border-radius: var(--button-radius);
  cursor: pointer;

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--margin-small);
    padding: 8px 16px;
  }

  // STATES
  &.state-primary {
    --background-color: var(--primary-color-400);
    &:hover {
      background-color: var(--primary-color-500);
      transition: 0.1s ease-in;
    }
  }
  &.state-success {
    --background-color: var(--secondary-color);
    --color: var(--grey-color-900);
  }

  &.state-destructive {
    --background-color: var(--destructive-color-200) !important;
    --color: var(--destructive-color-900) !important;
    opacity: 0.6;
  }

  /* DISABLED */
  &.state-disabled,
  &.disabled {
    --background-color: var(--grey-color-200);
    --color: var(--grey-color-500);
    cursor: not-allowed !important;
  }

  // TOOLTIPS
  &.hasTooltip {
    &::after {
      content: attr(data-tooltip);
      position: absolute;
      bottom: -1rem;
      background: var(--grey-color-300);
      border-radius: var(--corner-radius-small);
      color: var(--grey-color-900);
      font-size: var(--tiny);
      width: max-content;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      padding: var(--spacing-tiny);
    }

    &:not(.disabled):hover::after {
      opacity: 1;
    }
  }

  /* SIZE */
  &.size-tiny {
    // height: 2.5rem;
    min-width: max-content;
    // padding: 0 var(--spacing-small);
    font-size: 16px;
  }
  &.size-small {
    // height: 2.5rem;
    // min-width: max-content;
    min-width: max-content;
    // padding: 0 var(--spacing-medium);
    font-size: 16px;
  }
  &.size-large {
    // height: 3rem;
    // width: 100%;
    min-width: unset;
  }
}
</style>
