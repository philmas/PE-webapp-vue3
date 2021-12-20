<template>
  <div class="posts">
    <div class="actions">
      <FilterButtons> </FilterButtons>
      <ActionButtons rightAlign>
        <Button
          size="small"
          state="primary"
          icon="add"
          @click="$router.push('/cards/nieuweblog')"
          >Nieuw bericht</Button
        >
      </ActionButtons>
    </div>
    <InfiniteList @fetch="fetchItems" :autoLoad="true">
      <template #default="post">
        <!-- {{ post.canShare() }} -->
        <BlogPost :blog="post" @click="openPost(post)" />
      </template>

      <template #loading>
        <BlogPost />
      </template>
    </InfiniteList>

    <div v-if="openedPost" class="openCardWrapper">
      <BlogOpen :blog="openedPost" @clickBackToNews="backToNewsfeed" />
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

const nuxtApp = useNuxtApp();
const openedPost = ref<Post>();

const fetchItems = async (list: Ref<Post[]>, amount: number) => {
  const newCards = await Blogs.fetchBlogs(nuxtApp);

  list.value = list.value.concat(newCards.posts);
};

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
  const cardId = nuxtApp.$router.currentRoute.value.query?.id;

  // Set card to open if url has an Id of a blog post
  openedPost.value = cardId ? await Blog.fetchBlog(nuxtApp, cardId) : undefined;
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
