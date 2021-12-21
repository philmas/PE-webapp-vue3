<template>
  <div class="blogCard" :class="{ loading: true, noImage: !blog?.banner_id }">
    <div class="title">{{ blog?.title }}</div>
    <div class="datePosted">{{ blog?.created_at }}</div>

    <div v-if="blog?.content" class="content" v-html="content"></div>
    <div v-else class="content loadingContent"></div>

    <div
      v-if="blog.banner_id"
      class="image"
      :style="{ background: imageUrl }"
    ></div>

    <div class="footer">
      <div class="category" v-for="category in new Array()" :key="category">
        {{ category.name }}
      </div>

      <Avatar v-if="blog?.user_author" :userId="blog.user_author.id" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { Post } from '@/models/post';
import Avatar from './../Avatar.vue';

import { generateHTML } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

const storage = useStorage();
const props = defineProps({
  blog: {
    type: Object as PropType<Post>,
    required: false,
  },
});

const imageUrl = ref('none');

const content = computed(() => {
  if (!props.blog) return;
  if (!props.blog.content) return;

  return generateHTML(props.blog.content, [StarterKit]);
});

onMounted(async () => {
  if (!props.blog?.banner_id) {
    imageUrl.value = 'none';
    return;
  }

  const { signedURL, error } = await storage
    .from('blogs')
    .createSignedUrl(+props.blog.id + '/' + props.blog.banner_id, 60);

  if (error) return;
  imageUrl.value = `url(${signedURL})`;
});
</script>

<style scoped lang="scss">
.blogCard {
  --max-lines: 8;
  --vertical-gap: var(--spacing-large);
  --grid-columns: calc((100% - var(--vertical-gap)) / 2);
  cursor: pointer;

  display: grid;
  gap: var(--spacing-tiny) var(--vertical-gap);
  grid-template-columns: var(--grid-columns) var(--grid-columns);
  grid-template-areas: 'title title' 'datePosted image' 'content image' 'footer footer';

  & .title {
    grid-area: title;
    font-size: var(--subtitle);
    font-weight: bold;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & .datePosted {
    grid-area: datePosted;
    color: var(--grey-color-500);
  }

  & .content {
    grid-area: content;
    margin-top: var(--spacing-tiny);

    // Set max amount of rows to var(--max-lines) and add ellipsis to the end
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
    min-height: 9rem;

    &.loadingContent {
      border-radius: var(--corner-radius);
      background: var(--grey-color-300);
    }
  }

  & .image {
    grid-area: image;
    background-size: cover !important;
    background-position: center !important;
    border-radius: var(--corner-radius);
    min-height: 10rem;
  }

  & .footer {
    margin-top: var(--spacing-tiny);
    grid-area: footer;
    display: flex;
    align-items: center;
    gap: var(--spacing-small);

    & .category {
      color: var(--grey-color-600);
      background: var(--grey-color-200);
      padding: var(--padding-tiny) var(--padding-small);
      border-radius: var(--corner-radius);
      border: var(--border);
      font-size: var(--small);
      cursor: pointer;
      white-space: nowrap;
    }

    & .avatar {
      width: 100%;
      display: flex;
      justify-content: flex-end;
    }

    &.loadingFooter {
      height: 3rem;
      border-radius: var(--corner-radius);
      background: var(--grey-color-200);
    }
  }

  &.noImage {
    grid-template-areas: 'title title' 'datePosted datePosted' 'content content' 'footer footer';

    & .image {
      display: none;
    }

    & .content {
      min-height: unset;
    }
  }
}

@media screen and (max-width: 40rem) {
  .blogCard {
    grid-template-areas: 'title title' 'datePosted datePosted' 'image image' 'content content' 'footer footer' !important;

    & .image {
      min-height: 15rem;
    }

    & .content {
      min-height: unset;
    }
  }
}
</style>

<style>
.card .content p {
  margin: 0 !important;
}
</style>
