<template>
  <div class="container">
    <div class="actions">
      <FilterButtons></FilterButtons>
      <ActionButtons rightAlign>
        <Button
          size="small"
          state="primary"
          icon="add"
          @click="$router.push('/mijnposts')"
        >
          Mijn berichten
        </Button>
      </ActionButtons>
    </div>

    <InfiniteList :where="where">
      <template #default="post">
        <BlogPost :blog="new Post(post)" @click="openPost(post)" />
      </template>

      <template #loading> loading </template>
    </InfiniteList>

    <div v-if="openedPost" class="openCardWrapper">
      <BlogOpen :blog="openedPost" />
    </div>
  </div>
</template>

<script setup lang="ts">
import BlogPost from "@/components/blogs/BlogPost.vue";
import BlogOpen from "@/components/blogs/BlogOpen.vue";

import FilterButtons from "@/components/buttons/FilterButtons.vue";
import ActionButtons from "@/components/buttons/ActionButtons.vue";
import Button from "@/components/buttons/Button.vue";

import { Filter, Query, Post, PostInterface } from "../models/post";
import { nowDateString } from "~~/util/nowDateString";

const { $router } = useNuxtApp();
const openedPost = ref<Post>();
const cardId = computed(() => {
  const id = $router.currentRoute.value.query?.id;
  if (!id) return -1;
  return parseInt(id) || -1;
});
watch(cardId, (newId, oldId) => {
  if (newId === oldId) return;
  if (newId === -1) {
    openedPost.value = undefined;
    return;
  }
});
// WHERE -> published = true
const where: Query = (query: Filter) =>
  query.lte("publish_date", nowDateString());
// HANDLE OPEN / CLOSE BLOG POST
const openPost = async (postInterface: PostInterface) => {
  const post = new Post(postInterface);
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
  window.addEventListener("popstate", (e: PopStateEvent) => {
    if (e.state.current == "/") {
      openedPost.value = undefined;
    }
  });
});
</script>

<style lang="scss" scoped>
.actions {
  display: flex;
  width: var(--width-large);
  margin: 0 auto;
  .new-post {
    box-shadow: 0 0 0 1px rgba(9, 9, 9, 0.1);
  }
}

.container {
  margin: 64px auto;
}

.openCardWrapper {
  position: fixed;
  width: 100vw;
  height: 100vh;
  overflow: scroll;
  padding-top: 64px;
  top: 0;
  left: 0;
  background: var(--background-color);
}
</style>
