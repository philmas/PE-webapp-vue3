<template>
  <div class="avatar" :class="classes" @click="$emit('click')">
    <slot>{{ firstName }}</slot>
    <img :src="src" :alt="alt" @error="replaceByDefault" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';

type AvatarSize = 'small' | 'medium' | 'large' | 'huge';
type AvatarAlign = 'left' | 'right' | 'top' | 'bottom';

const props = defineProps({
  src: {
    type: String,
    default:
      'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg',
  },
  alt: {
    type: String,
    default: '',
  },
  size: {
    type: String as PropType<AvatarSize>,
    default: 'medium',
  },
  align: {
    type: String as PropType<AvatarAlign>,
    default: 'left',
  },
  name: {
    type: String,
    default: '',
  },
});
defineEmits(['click']);

const firstName = computed(() => {
  const name = props.name.split(' ');
  return name[0];
});

const classes = computed(() => {
  const classObject: { [key: string]: boolean } = {};
  classObject['size-' + props.size] = !!props.size;
  classObject['align-' + props.align] = !!props.align;
  return classObject;
});

const replaceByDefault = (e: Event) =>
  ((e.target as HTMLImageElement).src =
    'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg');
</script>

<style scoped lang="scss">
.avatar {
  --avatar-size: 3rem;
  --avatar-margin: 0;

  position: relative;
  display: flex;
  align-items: center;
  gap: 0 0.25rem;
  width: fit-content;
  margin: var(--avatar-margin);
  cursor: pointer;

  & img {
    height: var(--avatar-size);
    width: var(--avatar-size);
    cursor: pointer;
    border-radius: 50%;
    border: 1px solid var(--grey-color-200);
  }

  // IMAGE SIZE
  &.size- {
    &huge > img {
      --avatar-size: 15rem;
    }

    &large > img {
      --avatar-size: 4rem;
    }

    &small {
      font-size: 0.8rem;
      --avatar-size: 2rem;
    }
  }

  // IMAGE ALIGN
  &.align- {
    &-right {
      flex-direction: row-reverse;
    }

    &-top {
      flex-direction: column;
    }

    &-bottom {
      flex-direction: column-reverse;
    }
  }
}
</style>
