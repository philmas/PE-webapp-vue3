<template>
  <div>
    <ActionButtons>
      <Button
        size="small"
        state="primary"
        icon="arrow_back"
        @click="$router.push('/')"
      >
        Terug naar Nieuwsfeed
      </Button>
    </ActionButtons>

    <InfiniteList
      :where="whereUnpublished"
      :hideNoNewItems="true"
      title="Ongepubliceerde posts van jou"
    >
      <template #default="post">
        <BlogPost
          :blog="new Post(post)"
          @click="$router.push(`/blogs/nieweblog`)"
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
          @click="$router.push(`/blogs/nieweblog`)"
        />
      </template>

      <template #loading> loading </template>
    </InfiniteList>
  </div>
</template>

<script setup lang="ts">
import ActionButtons from '@/components/buttons/ActionButtons.vue';
import Button from '@/components/buttons/Button.vue';
import BlogPost from '@/components/blogs/BlogPost.vue';

import { Query, Filter, Post } from '@/models/post';

const now = new Date().toISOString().toLocaleString();
const whereUnpublished: Query = (query: Filter) =>
  query
    .eq('user_author', useUser().value.id)
    .or('publish_date.is.null,publish_date.gt.' + now);

const wherePublished: Query = (query: Filter) =>
  query.eq('user_author', useUser().value.id).lt('publish_date', now);
</script>

<style scoped lang="scss"></style>
