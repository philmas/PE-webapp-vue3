<template>
  <div
    class="blogCard"
    :class="{ loading: !blog, noImage: !blog?.photoMetaData?.ORIGINAL }"
    @click="$emit('click')"
  >
    <div class="title">{{ blog?.title }}</div>
    <div class="datePosted">{{ blog?.datePosted }}</div>
    <div class="content" :class="{ loadingContent: !blog?.content }">
      {{ blog?.content }}
    </div>

    <div class="image" :style="imageStyles"></div>

    <div class="footer">
      <Filter
        class="category"
        v-for="category in categoryList"
        :key="category.id"
      >
        #{{ category.name }}
      </Filter>
      <Avatar
        v-if="blog?.poster && blog.posterType == 'user'"
        :src="blog?.poster.getPhotoUrl()"
        :name="blog.poster.firstName"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { Blog } from "./../../models/posts/blogs";
import Avatar from "../Avatar.vue";
import Filter from "./../inputs/Filter.vue";

const props = defineProps({
  blog: {
    type: Object as PropType<Blog>,
    required: false,
  },
});

const imageStyles = computed(() => {
  if (!props.blog) return { background: "var(--grey-color-200)" };
  if (!props.blog.photoMetaData) return;

  return { background: `url(${props.blog.getPhotoUrl()})` };
});

const categoryList = computed(() => {
  if (!props.blog?.category) return;
  return [props.blog.category];
});
</script>

<style scoped lang="scss">
.blogCard {
  --max-lines: 8;
  --vertical-gap: var(--margin-large);
  --grid-columns: calc((100% - var(--vertical-gap)) / 2);
  cursor: pointer;

  display: grid;
  gap: var(--margin-tiny) var(--vertical-gap);
  grid-template-columns: var(--grid-columns) var(--grid-columns);
  grid-template-areas: "title title" "datePosted image" "content image" "footer footer";

  & .title {
    grid-area: title;
    font-size: var(--blog-title-font-size);
    font-weight: var(--blog-title-font-weight);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }

  & .datePosted {
    grid-area: datePosted;
    color: var(--blog-date-font-color);
    font-size: var(--blog-date-font-size);
    font-weight: var(--blog-date-font-weight);
  }

  & .content {
    grid-area: content;
    margin-top: 0.25rem;

    // Set max amount of rows to var(--max-lines) and add ellipsis to the end
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: var(--max-lines);
    -webkit-box-orient: vertical;
    min-height: 9rem;

    font-size: var(--blog-content-font-size);
    font-weight: var(--blog-content-font-weight);
    line-height: var(--blog-content-line-height);
    color: var(--blog-content-font-color);

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
    margin-top: var(--margin-tiny);
    grid-area: footer;
    display: flex;
    align-items: center;
    gap: var(--margin-small);

    & .category {
      // color: var(--pill-font-color);
      // background: var(--pill-background);
      // border-radius: var(--pill-border-radius);
      // font-size: var(--pill-font-size);
      outline: var(--pill-outline);
      // padding: var(--pill-padding-vertical) var(--pill-padding-horizontal);
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
    grid-template-areas: "title title" "datePosted datePosted" "content content" "footer footer";

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
    grid-template-areas: "title title" "datePosted datePosted" "image image" "content content" "footer footer" !important;

    & .image {
      min-height: 15rem;
    }

    & .content {
      min-height: unset;
    }
  }
}
</style>
