<template>
  <div class="input-box" :class="classes">
    <label :for="id">
      <div v-if="inputTitle" class="label">{{ inputTitle }}</div>
      <input
        v-model="input"
        :type="type"
        :autocomplete="autocomplete"
        :disabled="disabled"
        :id="id"
        :placeholder="placeholder"
        :required="required"
        @focus="focus = true"
        @blur="focus = false"
      />
      <ion-icon
        v-if="icon"
        :icon="icon"
        class="icon"
        @click.stop="emitIconClick"
      />
    </label>
    <div v-if="error" class="error">{{ error }}</div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';

type InputTypes =
  | 'text'
  | 'password'
  | 'email'
  | 'number'
  | 'tel'
  | 'url'
  | 'search'
  | 'date'
  | 'time'
  | 'month'
  | 'week'
  | 'color'
  | 'file'
  | 'range'
  | 'checkbox'
  | 'radio'
  | 'hidden';

type InputSize = 'small' | 'medium' | 'large';

const props = defineProps({
  type: String as PropType<InputTypes>,
  modelValue: String,
  placeholder: String,
  label: String,
  icon: String,
  error: String,
  autocomplete: String,
  size: String as PropType<InputSize>,
  disabled: Boolean,
  required: Boolean,
});
const emit = defineEmits(['update:modelValue', 'iconClick']);

// random string
const id = 'input-' + Math.random().toString(36).substring(2, 9);

const focus = ref(false);
const inputTitle = computed(() => {
  let title = props.label || props.placeholder || props.type;
  if (props.required) title += '*';

  return title;
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

// Handle Classes
const classes = computed(() => {
  const classes: { [key: string]: boolean } = {};
  classes['size-' + props.size] = !!props.size;
  classes['focus'] = !!focus.value;
  classes.disabled = !!props.disabled;
  return classes;
});

// Emit icon click
const emitIconClick = () => {
  if (props.disabled) return;
  emit('iconClick');
};
</script>

<style scoped lang="scss">
.input-box {
  margin: var(--spacing-large) 0;
  width: 100%;

  & label {
    position: relative;
    border-radius: var(--inner-corner-radius);
    display: flex;
    align-items: center;
    outline: 1px solid var(--grey-color-400);

    & .label {
      position: absolute;
      left: 0.75rem;
      top: -11px;
      background: var(--white-color);
      padding: 2px;
      color: var(--grey-color-700);
      font-size: var(--tiny);
    }

    & input {
      width: var(--width-full);
      padding: var(--spacing-input);
      outline: none !important;
      border: none;
      background: var(--transparent-color);
      border-radius: var(--inner-corner-radius);
    }
  }

  &.focus {
    & label {
      outline: 1px solid var(--primary-color, #0058a9);
    }
    & .label {
      color: var(--primary-color, #0058a9);
    }
  }
}

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus,
input:-webkit-autofill:active {
  -webkit-box-shadow: 0 0 0 30px white inset !important;
}
</style>
