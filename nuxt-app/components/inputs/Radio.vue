<template>
  <div class="wrapper" :class="classes">
    <div v-if="label" class="label">{{ label }}</div>
    <div class="radio">
      <label
        v-for="option in options"
        :for="label + option"
        :key="option"
        class="item"
        :class="{ checked: input == option }"
      >
        <input
          type="radio"
          :id="label + option"
          :value="option"
          :disabled="disabled"
          v-model="input"
        />
        <div class="checkmark"></div>
        <div class="option">{{ option }}</div>
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

const props = defineProps({
  modelValue: String,
  options: Array as PropType<string[]>,
  label: String,
  disabled: Boolean,
  orientation: String as PropType<'horizontal' | 'vertical'>,
  size: String as PropType<'small' | 'medium' | 'large'>,
});
const emit = defineEmits(['update:modelValue']);

const classes = computed(() => {
  const classes: { [key: string]: boolean } = {};
  classes['size-' + props.size] = !!props.size;
  classes['disabled'] = props.disabled;
  classes['row'] = props.orientation !== 'horizontal';
  return classes;
});

// Handle V-modal
const input = computed({
  get() {
    return props.modelValue as string;
  },
  set(value: string) {
    emit('update:modelValue', value);
  },
});
</script>

<style scoped lang="scss">
.wrapper {
  .radio {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-evenly;
    width: var(--width, 20rem);
    border-radius: var(--inner-corner-radius);
    background: var(--grey-color-200);
    padding: var(--spacing-input);
    font-size: var(--small);

    & label {
      display: flex;
      align-items: center;
      width: 100%;
      cursor: pointer;

      & input[type='radio'] {
        all: unset;
      }

      & .checkmark {
        height: 20px;
        width: 20px;
        border: 1px solid var(--grey-color-500);
        margin-right: 0.4rem;
        border-radius: 50%;
        position: relative;
      }

      &.checked {
        & .checkmark {
          border-color: var(--primary-color);

          &:after {
            content: '';
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: var(--primary-color);
          }
        }
      }
    }
  }

  & .label {
    user-select: none;
    font-size: 0.8rem;
    --webkit-user-select: none;
    --moz-user-select: none;
  }

  &.row .radio {
    flex-direction: column;
    align-items: flex-start;
    justify-content: start;
    gap: var(--spacing-small);
  }

  &.disabled {
    & .radio {
      border-color: var(--grey-color-500) !important;
    }

    & .label {
      color: var(--grey-color-500) !important;
    }

    & .checkmark {
      border-color: var(--grey-color-500) !important;
    }

    & .checkmark:after {
      background: var(--grey-color-500) !important;
    }
  }
}

.size-large {
  --width: 100%;
}

/* Label */
</style>
