<template>
  <div class="container">
    <div class="actions">
      <ActionButtons>
        <Button
          size="small"
          state="primary"
          icon="arrow_back"
          @click="$router.push('/')"
        >
          Nieuwsfeed
        </Button>

        <Button
          class="moveToRight"
          size="small"
          state="primary"
          icon="edit"
          :loading="newPostLoading"
          @click="insertNewPost"
        >
          Nieuw bericht
        </Button>
      </ActionButtons>
    </div>
    <InfiniteList
      :where="whereUnpublished"
      :hideNoNewItems="true"
      title="Ongepubliceerde posts van jou"
    >
      <template #default="post">
        <BlogPost
          :blog="new Post(post)"
          @click="$router.push(`/blogs/aanpassen?id=${post.id}`)"
        />
      </template>

      <template #loading> loading </template>
    </InfiniteList>

    <InfiniteList
      :where="wherePublished"
      :hideNoNewItems="true"
      title="Gepubliceerde posts van jou"
    >
      <template #default="post">
        <BlogPost
          :blog="new Post(post)"
          @click="$router.push(`/blogs/aanpassen?id=${post.id}`)"
        />
      </template>

      <template #loading> loading </template>
    </InfiniteList>
  </div>
</template>

<script setup lang="ts">
import ActionButtons from "@/components/buttons/ActionButtons.vue";
import Button from "@/components/buttons/Button.vue";
import BlogPost from "@/components/blogs/BlogPost.vue";

import {
  Query,
  Filter,
  Post,
  newEmptyBlog,
  PostInterface,
} from "~~/models/Post";

const newPostLoading = ref(false);

// TODO: test this
const insertNewPost = async () => {
  const supabase = useSupabase();
  const { $router } = useNuxtApp();
  newPostLoading.value = true;

  const { data, error } = await supabase
    .from<PostInterface>("News_items")
    .insert(newEmptyBlog())
    .single();

  console.log(data, error);

  if (data?.id) $router.push(`/blogs/aanpassen?id=${data.id}`);

  // route to editor
  newPostLoading.value = false;
};

const now = new Date().toISOString().toLocaleString();
const whereUnpublished: Query = (query: Filter) =>
  query
    .eq("user_author", useUser().value.id)
    .or("publish_date.is.null,publish_date.gt." + now);

const wherePublished: Query = (query: Filter) =>
  query.eq("user_author", useUser().value.id).lt("publish_date", now);
</script>

<style scoped lang="scss">
.moveToRight {
  margin-left: auto;
}

.container {
  margin: 64px auto;
}

.actions {
  display: flex;
  width: var(--width-large);
  margin: 0 auto;
  .new-post {
    box-shadow: 0 0 0 1px rgba(9, 9, 9, 0.1);
  }
}
</style>
