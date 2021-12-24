<template>
  <div class="posts">
    <div class="actions">
      <FilterButtons> </FilterButtons>
      <ActionButtons rightAlign>
        <Button
          size="small"
          state="primary"
          icon="add"
          class="new-post"
          @click="$router.push('/cards/nieuweblog')"
          >Nieuw bericht</Button
        >
      </ActionButtons>
    </div>
    <InfiniteList @fetch="fetchItems" :autoLoad="true">
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
import InfiniteList from "@/components/InfiniteList.vue";
import BlogOpen from "@/components/cards/BlogOpen.vue";
import BlogPost from "@/components/cards/BlogPost.vue";

import { Ref, onMounted, onBeforeMount } from "vue";
import { Post } from "../models/posts/post";
import { Blog, Blogs } from "./../models/posts/blogs";

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
const openPost = (post: Post) => {
  openedPost.value = new Blog(post);

  const nextURL = `?id=${post.id}`;
  nuxtApp.$router.push(nextURL);
};

const backToNewsfeed = () => {
  openedPost.value = undefined;
  nuxtApp.$router.push("/");
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
.posts {
  margin: var(--margin-huge) 0;
}

.actions {
  display: flex;
  width: var(--width-large);
  margin: 0 auto;

  .new-post {
    box-shadow: 0 0 0 1px rgba(9, 9, 9, 0.1);
  }
}

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
