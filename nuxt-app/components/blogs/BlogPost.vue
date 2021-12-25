<template>
  <div
    class="blogCard"
    :class="{ noImage: !blog?.has_banner }"
    @click="$emit('click')"
  >
    <div class="title">{{ blog?.title }}</div>
    <div class="datePosted">{{ Post.formatDate(blog.publish_date) }}</div>

    <div v-if="blog?.content" class="content" v-html="blog.htmlContent"></div>
    <div v-else class="content loadingContent"></div>

    <div
      v-if="blog.has_banner"
      class="image"
      :style="{ background: imageUrl }"
    ></div>

    <div class="footer">
      <Filter
        class="category"
        v-for="category in categoryList"
        :key="category.id"
      >
        # {{ category.name }}
      </Filter>

      <Avatar
        v-if="blog?.user_author"
        :fullName="true"
        :userId="blog.user_author_id"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Post } from "@/models/Post";
import Avatar from "@/components/Avatar.vue";
import Filter from "@/components/inputs/Filter.vue";

const props = defineProps({
  blog: {
    type: Object as PropType<Post>,
    required: false,
  },
});
defineEmits(["click"]);

const imageUrl = ref("none");

onMounted(async () => {
  const bannerUrl = await props.blog.bannerUrl();

  if (!bannerUrl) return;
  imageUrl.value = `url(${bannerUrl})`;
});
</script>

<style scoped lang="scss">
// .blogCard {
//   --max-lines: 8;
//   --vertical-gap: var(--spacing-large);
//   --grid-columns: calc((100% - var(--vertical-gap)) / 2);
//   cursor: pointer;

//   display: grid;
//   gap: var(--spacing-tiny) var(--vertical-gap);
//   grid-template-columns: var(--grid-columns) var(--grid-columns);
//   grid-template-areas: "title title" "datePosted image" "content image" "footer footer";

//   & .title {
//     grid-area: title;
//     font-size: var(--subtitle);
//     font-weight: bold;
//     overflow: hidden;
//     white-space: nowrap;
//     text-overflow: ellipsis;
//   }

//   & .datePosted {
//     grid-area: datePosted;
//     color: var(--grey-color-500);
//   }

//   & .content {
//     grid-area: content;
//     margin-top: var(--spacing-tiny);

//     // Set max amount of rows to var(--max-lines) and add ellipsis to the end
//     overflow: hidden;
//     display: -webkit-box;
//     -webkit-line-clamp: var(--max-lines);
//     -webkit-box-orient: vertical;
//     min-height: 9rem;

//     &.loadingContent {
//       border-radius: var(--corner-radius);
//       background: var(--grey-color-300);
//     }
//   }

//   & .image {
//     grid-area: image;
//     background-size: cover !important;
//     background-position: center !important;
//     border-radius: var(--corner-radius);
//     min-height: 10rem;
//   }

//   & .footer {
//     margin-top: var(--spacing-tiny);
//     grid-area: footer;
//     display: flex;
//     align-items: center;
//     gap: var(--spacing-small);

//     & .category {
//       color: var(--grey-color-600);
//       background: var(--grey-color-200);
//       padding: var(--spacing-tiny) var(--spacing-small);
//       border-radius: var(--corner-radius);
//       border: var(--border);
//       font-size: var(--small);
//       cursor: pointer;
//       white-space: nowrap;
//     }

//     & .avatar {
//       width: 100%;
//       display: flex;
//       justify-content: flex-end;
//     }

//     &.loadingFooter {
//       height: 3rem;
//       border-radius: var(--corner-radius);
//       background: var(--grey-color-200);
//     }
//   }

//   &.noImage {
//     grid-template-areas: "title title" "datePosted datePosted" "content content" "footer footer";

//     & .image {
//       display: none;
//     }

//     & .content {
//       min-height: unset;
//     }
//   }
// }

// @media screen and (max-width: 40rem) {
//   .blogCard {
//     grid-template-areas: "title title" "datePosted datePosted" "image image" "content content" "footer footer" !important;

//     & .image {
//       min-height: 15rem;
//     }

//     & .content {
//       min-height: unset;
//     }
//   }
// }
.blogCard {
  --max-lines: 8;
  --vertical-gap: var(--margin-large);
  --grid-columns: calc((100% - var(--vertical-gap)) / 2);
  cursor: pointer;
  display: grid;
  gap: var(--gap-8) 0;
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
    margin-top: var(--gap-8);
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
    margin-top: var(--gap-16);
    grid-area: footer;
    display: flex;
    align-items: center;
    gap: var(--margin-small);
    & .category {
      // color: var(--pill-font-color);
      // background: var(--pill-background);
      // border-radius: var(--pill-border-radius);
      // font-size: var(--pill-font-size);
      // outline: var(--pill-outline);
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
<style>
.blogCard .content p {
  margin: 0 !important;
}
</style>
