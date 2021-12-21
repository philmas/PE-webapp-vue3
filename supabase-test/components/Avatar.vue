<template>
  <div class="avatar" :class="classes" @click.self="$emit('click')">
    <div>
      <slot>{{ displayName }}</slot>
    </div>

    <img :alt="displayName + '\'s profielfoto'" :src="src" />
  </div>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue';
import { UserData } from '~~/models/userData';

type AvatarSize = 'small' | 'medium' | 'large' | 'huge';
type AvatarAlign = 'left' | 'right' | 'top' | 'bottom';

const storage = useStorage();
const supabase = useSupabase();
const props = defineProps({
  userId: {
    type: String,
  },
  size: {
    type: String as PropType<AvatarSize>,
    default: 'medium',
  },
  align: {
    type: String as PropType<AvatarAlign>,
    default: 'left',
  },
  fullName: {
    type: Boolean,
    default: false,
  },
});
defineEmits(['click']);

const src = ref(
  'https://t3.ftcdn.net/jpg/03/46/83/96/360_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg'
);
const userData = ref<UserData>();
const displayName = computed(() => {
  if (!userData.value) return '';

  let name = userData.value.name_first;
  if (!props.fullName) return name;

  name += userData.value.name_insertion
    ? ' ' + userData.value.name_insertion
    : '';
  name += ' ' + userData.value.name_last;
  return name;
});

onMounted(async () => {
  const { data } = await supabase
    .from<UserData>('User')
    .select('*')
    .eq('id', props.userId)
    .single();

  userData.value = data;

  if (data) {
    const { signedURL, error } = await storage
      .from('profile')
      .createSignedUrl('gebruikers/' + data.id + '/' + data.photo_id, 60);

    if (signedURL) {
      src.value = signedURL;
    } else {
      console.error(error);
    }
  }
});

const classes = computed(() => {
  const classObject: { [key: string]: boolean } = {};
  classObject['size-' + props.size] = !!props.size;
  classObject['align-' + props.align] = !!props.align;
  return classObject;
});
</script>

<style scoped lang="scss">
.avatar {
  --avatar-size: 3rem;

  position: relative;
  display: flex;
  align-items: center;
  gap: 0 var(--spacing-small);
  width: fit-content;
  color: var(--grey-color-800);
  font-size: var(--small);
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
      font-size: var(--small);
      --avatar-size: 2rem;
    }
  }

  // IMAGE ALIGN
  &.align- {
    &right {
      flex-direction: row-reverse;
    }

    &top {
      flex-direction: column;
    }

    &bottom {
      flex-direction: column-reverse;
    }
  }
}
</style>
