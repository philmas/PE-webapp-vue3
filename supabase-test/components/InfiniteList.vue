<template>
  <div class="list">
    <!-- Loaded items in list -->
    <section v-for="(post, index) in list" :key="index" class="card">
      <slot v-bind="post"> {{ post }}</slot>
    </section>

    <section v-for="item in new Array(itemsToLoad)" :key="item" class="card">
      <slot name="loading"></slot>
    </section>

    <div class="loadMore">
      <Button
        v-if="!reachedBottom"
        @click="loadMore"
        :loading="itemsToLoad != 0"
        >Meer laden</Button
      >
      <Button v-else :disabled="true"
        >Er zijn geen nieuwe niews items meer</Button
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Post } from '@/models/Post';
import Button from './buttons/Button.vue';

const list = ref<Post[]>([]);
const itemsToLoad = ref(10);
const reachedBottom = ref(false);

const loadMore = () => {
  itemsToLoad.value = 10;

  setTimeout(() => {
    itemsToLoad.value = 0;
  }, 3000);
};

onMounted(async () => {
  const supabase = useSupabase();

  const { data } = await supabase
    .from<Post>('News_items')
    .select('*, user_author (*)')
    .order('created_at', { ascending: false })
    .limit(10);

  if (data) {
    list.value = [...list.value, ...data];

    reachedBottom.value = data.length < 10;
  }

  itemsToLoad.value = 0;
});
</script>

<style scoped lang="scss">
.list {
  --list-width: var(--width-large);

  width: var(--list-width);
  margin: var(--spacing-large) auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-large);

  & .card {
    padding: var(--spacing-large);
    background: var(--white-color);
    border-radius: var(--corner-radius);
  }
}

.loadMore {
  display: flex;
  justify-content: center;
  margin-top: var(--spacing-large);
}

@media screen and (max-width: 40rem) {
  .list {
    --list-width: var(--width-full);
    gap: 0;

    & .card {
      padding: var(--spacing-huge);
      border-radius: 0;
    }

    & .card:first-of-type {
      border-radius: var(--corner-radius-large) var(--corner-radius-large) 0 0;
    }

    &.card:last-of-type {
      border-radius: 0 0 var(--corner-radius-large) var(--corner-radius-large);
    }

    & .card:not(:last-child) {
      border-bottom: 2px solid var(--grey-color-200);
    }
  }
}
</style>
