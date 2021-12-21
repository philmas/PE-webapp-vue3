<template>
  <div>
    <ActionButtons rightAlign>
      <Button
        size="small"
        state="primary"
        icon="add"
        @click="$router.push('/cards/nieuweblog')"
      >
        Nieuw bericht
      </Button>
    </ActionButtons>

    <InfiniteList>
      <template #default="post">
        <BlogPost :blog="post" @click="openPost(post)" />
      </template>

      <template #loading> loading </template>
    </InfiniteList>

    <div v-if="openedPost" class="openCardWrapper">
      <BlogOpen :blog="openedPost" />
    </div>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import BlogPost from '@/components/blogs/BlogPost.vue';
import BlogOpen from '@/components/blogs/BlogOpen.vue';
import { Post } from '../models/post';

const { $router } = useNuxtApp();

const openedPost = ref<Post>();

const cardId = computed(() => {
  const id = $router.currentRoute.value.query?.id;
  return parseInt(id) || -1;
});
watch(cardId, (newId, oldId) => {
  if (newId === oldId) return;
  if (newId === -1) {
    openedPost.value = undefined;
    return;
  }
});

// HANDLE OPEN / CLOSE BLOG POST
const openPost = (post: Post) => {
  openedPost.value = post;
  $router.push(`?id=${post.id}`);
};

onBeforeMount(async () => {
  const cardId = $router.currentRoute.value.query?.id;
  if (!cardId) return;

  const post = await Post.fetch(cardId);

  if (post) openedPost.value = post;
  // todo: else display error in (confirm) message
});
onMounted(async () => {
  window.addEventListener('popstate', (e: PopStateEvent) => {
    if (e.state.current == '/') {
      openedPost.value = undefined;
    }
  });
});
</script>

<style lang="scss" scoped>
.openCardWrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  padding-top: 4rem;
  top: 0;
  left: 0;
  background: var(--background-color);
}
</style>
