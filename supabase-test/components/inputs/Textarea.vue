<template>
  <div class="input-textarea" :placeholder="placeholder" :class="classes">
    <label v-if="label" class="label" :for="id">{{ label }}</label>
    <div
      ref="textarea"
      class="textarea"
      :style="styles"
      :contenteditable="!disabled"
      @keyup="handleInput"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

const props = defineProps({
  label: String,
  placeholder: String,
  modelValue: String,
  disabled: Boolean,
  resizeable: Boolean,
  size: String as PropType<'small' | 'medium' | 'large'>,
  minRows: {
    type: Number as PropType<number>,
    default: 4,
  },
  maxRows: {
    type: Number as PropType<number>,
    default: 10,
  },
});
const emit = defineEmits(['update:modelValue']);

const id = 'textarea-' + Math.random().toString(36).substring(2, 9);
const textarea = ref<HTMLInputElement>();

const classes = computed(() => {
  const classes: { [key: string]: boolean } = {};
  classes['size-' + props.size] = !!props.size;
  classes['disabled'] = props.disabled as boolean;
  classes['resize'] = props.resizeable as boolean;
  classes['placeholder-visible'] = !props.modelValue;
  return classes;
});

const styles = computed(() => {
  let styles: { [key: string]: string } = {};
  styles['min-height'] = 1.1 * props.minRows + 1 + 'rem';
  styles['max-height'] = 1.1 * props.maxRows + 1 + 'rem';
  return styles;
});

// Handle V-modal
const handleInput = (e: KeyboardEvent) => {
  const val = (e.target as HTMLInputElement).innerHTML;
  emit('update:modelValue', val);
};

const clearTextarea = () => {
  if (textarea.value) {
    textarea.value.innerHTML = '';
    emit('update:modelValue', '');
  }
};

onMounted(() => {
  if (textarea.value) {
    const copyTextarea = textarea.value;
    copyTextarea.innerHTML = props.modelValue as string;

    textarea.value = copyTextarea;
  }
});

defineExpose({
  clearTextarea,
});
</script>

<style scoped lang="scss">
.input-textarea {
  position: relative;
  width: var(--width, 20rem);

  &.size- {
    &large {
      width: 100%;
    }
  }

  & .label {
    font-size: var(--small);
    user-select: none;
    --webkit-user-select: none;
    --moz-user-select: none;
  }

  & .textarea {
    background: var(--bg, var(--grey-color-200));
    border-radius: var(--corner-radius);
    padding: 0.5rem;
    width: 100%;
    overflow-y: auto;
  }

  &.disabled {
    & .textarea {
      border-color: var(--grey-color-500);
      color: var(--grey-color-500);
    }

    .label {
      color: var(--grey-color-500);
    }
  }
}

.placeholder-visible.input-textarea::after {
  content: attr(placeholder);
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  color: hsl(215.2, 11.7%, 48.4%);
  pointer-events: none;
}
</style>
