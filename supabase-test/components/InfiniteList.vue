<template>
  <div class="list">
    <div v-if="title" class="title">{{ title }}</div>

    <!-- Loaded items in list -->
    <section v-for="post in list" class="card">
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
        size="small"
      >
        Meer laden
      </Button>

      <Button v-else-if="!hideNoNewItems" size="small" :disabled="true">
        Er zijn geen nieuwe nieuws items meer
      </Button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import { Post, Query } from '@/models/post';
import Button from '@/components/buttons/Button.vue';

const props = defineProps({
  title: {
    type: String as PropType<string>,
    required: false,
  },
  where: {
    type: Function as PropType<Query>,
    default: null,
  },
  hideNoNewItems: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
});

const list = ref<Post[]>([]);
const itemsToLoad = ref(10);
const reachedBottom = ref(false);

const loadMore = () => {
  console.log('Todo: load more');
  itemsToLoad.value = 10;

  setTimeout(() => {
    itemsToLoad.value = 0;
  }, 3000);
};

onMounted(async () => {
  const posts = await Post.fetchNext(10, 0, props.where);

  if (posts) {
    list.value = [...list.value, ...posts];
    reachedBottom.value = posts.length < 10;
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

  .title {
    font-size: var(--header);
  }

  .card {
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
