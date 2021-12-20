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
      <slot></slot>
    </div>
  </button>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

type ButtonState =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'disabled'
  | 'destructive'
  | 'link';

const props = defineProps({
  icon: {
    type: String,
    default: '',
  },
  state: {
    type: String as PropType<ButtonState>,
    default: 'default',
  },
  size: {
    type: String as PropType<'tiny' | 'small' | 'medium' | 'large'>,
    default: 'medium',
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
  classObj['disabled'] = !!props.disabled || !!props.loading;
  classObj['size-' + props.size] = !!props.size;
  classObj['state-' + props.state] = !!props.state;
  classObj['hasTooltip'] = !!props.tooltip;
  return classObj;
});
</script>

<style scoped lang="scss">
button {
  --button-color: var(--white-color);
  --button-background: var(--grey-color-900);
  --button-radius: var(--corner-radius);

  position: relative;
  all: unset;
  color: var(--button-color);
  background: var(--button-background);
  border-radius: var(--button-radius);
  cursor: pointer;
  transform: scale(1);
  transition: transform 0.2s, opacity 0.2s;

  & > div {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: var(--margin-small);
  }

  // STATES
  &.state-primary {
    --button-background: var(--primary-color-400);
  }

  &.state-success {
    --button-background: var(--secondary-color);
    --button-color: var(--grey-color-900);
  }

  &.state-destructive {
    --button-background: var(--destructive-color-200) !important;
    --button-color: var(--destructive-color-900) !important;
    opacity: 0.6;
  }

  &.state-link {
    --button-background: var(--transparent-color);
    --button-color: var(--grey-color-900);
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
      padding: var(--padding-tiny);
    }

    &:not(.disabled):hover::after {
      opacity: 1;
    }
  }

  /* SIZE */
  &.size-tiny {
    min-width: max-content;
    padding: var(--padding-tiny);
    font-size: 0.8rem !important;
    font-size: var(--small);
  }
  &.size-small {
    min-width: max-content;
    padding: var(--padding-medium);
    font-size: var(--small);
  }
  &.size-large {
    height: 3rem;
    width: 100%;
    min-width: unset;
  }

  &:hover {
    transform: scale(1.05);
    opacity: 1;

    &.size-tiny {
      transform: scale(1.1);
    }
  }
}

/* DISABLED */
button.state-disabled,
button.disabled {
  --button-background: var(--grey-color-200);
  --button-color: var(--grey-color-500);
  cursor: not-allowed !important;
}
</style>
