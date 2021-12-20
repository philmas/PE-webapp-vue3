<template>
  <label :for="id" :class="classes">
    <input type="checkbox" :id="id" :disabled="disabled" v-model="input" />
    <span class="checkmark"></span>
    <div class="label">
      <slot name="label">
        {{ label }}
      </slot>
    </div>
  </label>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { randomId } from './../util/random';

const props = defineProps({
  modelValue: Boolean,
  label: String,
  disabled: Boolean,
  filled: Boolean,
  size: String as PropType<'small' | 'medium' | 'large'>,
});
const emit = defineEmits(['update:modelValue']);

const id = randomId('checkbox');

const input = computed({
  get() {
    return props.modelValue as boolean;
  },
  set(value: boolean) {
    emit('update:modelValue', value);
  },
});

// Classes
const classes = computed(() => {
  const classes: { [key: string]: boolean } = {};
  classes['size-' + props.size] = !!props.size;
  classes['disabled'] = props.disabled;
  classes['checked'] = !!input.value;
  classes['filled'] = props.filled;
  return classes;
});
</script>

<style scoped lang="scss">
label {
  --width: 20rem;
  display: flex;
  align-items: center;
  width: var(--width);

  & input[type='checkbox'] {
    all: unset;
  }

  & .checkmark {
    height: 20px;
    width: 20px;
    border: 1px solid var(--grey-color-500);
    margin-right: 0.4rem;
    border-radius: 0.25rem;
    position: relative;
  }

  & .label {
    width: 100%;
    font-size: 0.9rem;
    user-select: none;
    --webkit-user-select: none;
    --moz-user-select: none;
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
        border-radius: 0.1rem;
        background: var(--primary-color);
      }
    }
  }

  // Properties
  &.filled {
    background: var(--grey-color-200);
    border-radius: var(--inner-corner-radius);
    padding: var(--spacing-input);
  }

  &.disabled {
    &.filled {
      border-color: var(--grey-color-500);
    }

    & .checkmark {
      background: var(--grey-color-100);
      border-color: var(--grey-color-300);

      &:after {
        background: var(--grey-color-300);
      }
    }

    .label {
      color: var(--grey-color-500);
    }
  }
}
</style>
