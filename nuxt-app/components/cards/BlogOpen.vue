<template>
  <div class="BlogOpenWrapper">
    <section class="actionButtons">
      <Button
        size="small"
        state="primary"
        icon="arrow_back"
        @click="$emit('clickBackToNews')"
      >
        Nieuwsfeed
      </Button>
      <Button
        v-if="User.isOwner(blog?.poster.userId)"
        size="small"
        icon="edit"
        @click="$emit('clickEdit')"
      >
        Bewerken
      </Button>
    </section>

    <section
      class="image"
      v-if="blog?.photoMetaData"
      :style="'background: url(' + blog?.getPhotoUrl() + ')'"
    />

    <section class="blogCard">
      <div class="header">
        <div class="titles">
          <div class="title">{{ blog?.title }}</div>
          <div class="datePosted">{{ blog?.datePosted }}</div>
        </div>
        <Avatar
          :src="blog?.poster.getPhotoUrl()"
          :name="blog?.poster.fullName"
        />
      </div>
      <div class="content">
        {{ blog?.content }}
      </div>
    </section>

    <section class="comments">
      <div class="commentTitle">Opmerkingen</div>
      <div class="comment" v-for="comment in blog?.comments || []">
        <div class="avatar"></div>
        <div class="text-wrapper">
          <div>
            <a class="name">{{ comment.poster.fullName }}</a>
          </div>
          {{ comment.comment }}
        </div>
        <div class="actions">
          <Button
            v-if="User.isOwner(comment.poster.userId)"
            size="tiny"
            icon="clear"
            state="destructive"
            @click="blog?.deleteComment(nuxtApp, comment.id)"
          />
        </div>
      </div>

      <div class="newComment">
        <Textarea
          size="large"
          placeholder="nieuw reactie"
          :minRows="2"
          ref="textAreaRef"
          v-model="newComment"
        />
      </div>
    </section>

    <section class="actionButtons bottomActions">
      <Button
        v-if="blog?.canShare()"
        size="small"
        state="primary"
        icon="share"
        @click="blog?.share"
      >
        Delen
      </Button>
      <Button
        size="small"
        :state="likedState"
        icon="favorite_border"
        @click="blog?.toggleLike(nuxtApp)"
      >
        {{ likes }}
      </Button>
      <Button size="small" icon="reply" @click="comment">Reageer</Button>
    </section>
  </div>
</template>

<script setup lang="ts">
import { PropType, computed } from "vue";
import { NuxtApp } from "../../models/nuxtApp";
import { User } from "./../../models/user";
import { Blog } from "./../../models/posts/blogs";

import Avatar from "./../Avatar.vue";
import Button from "./../Button.vue";
import Textarea from "./../inputs/Textarea.vue";

const props = defineProps({
  blog: {
    type: Object as PropType<Blog>,
    required: false,
  },
});

const nuxtApp = useNuxtApp() as unknown as NuxtApp;
const newComment = ref("");
const textAreaRef = ref();

const comment = async () => {
  await props.blog?.comment(nuxtApp, newComment.value);
  textAreaRef.value?.clearTextarea();
};

const likedState = computed(() => {
  const likedBy = Array.from(props.blog?.likedBy || []);
  const { $user } = useNuxtApp() as unknown as NuxtApp;

  if (!$user?.value) return "default";
  if (!likedBy.includes($user.value.userId)) return "default";
  return "primary";
});

const likes = computed(() => {
  if (!props.blog) return "like";
  if (props.blog.likedBy.length == 1)
    return props.blog.likedBy.length + " kudo";
  return props.blog.likedBy.length + " kudos";
});
</script>

<style lang="scss" scoped>
.BlogOpenWrapper {
  width: var(--blog-width);
  max-width: 90vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--margin-medium);
}

.actionButtons {
  display: flex;
  gap: var(--margin-small);

  &.bottomActions {
    justify-content: end;
  }
}

.blogCard {
  background-color: var(--blog-background);
  padding: var(--blog-padding);

  & .header {
    margin-bottom: var(--blog-header-bottom-margin);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }

  & .title {
    grid-area: title;
    font-size: var(--blog-title-font-size);
    font-weight: var(--blog-title-font-weight);
    margin-bottom: 4px;
  }

  & .datePosted {
    grid-area: datePosted;
    color: var(--blog-date-font-color);
    font-size: var(--blog-date-font-size);
    font-weight: var(--blog-date-font-weight);
  }
}

.image {
  width: 100%;
  height: 15rem;
  border-radius: var(--corner-radius);
  background-size: cover !important;
  background-position: center center !important;
}

.content {
  background: var(--white-color);
  text-align: left;
  font-size: var(--blog-content-font-size);
  font-weight: var(--blog-content-font-weight);
  line-height: var(--blog-content-line-height);
  color: var(--blog-content-font-color);

  & .titles {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;

    & .header {
      font-size: var(--header);
    }

    & .date {
      font-size: var(--small);
      color: var(--grey-color-800);
    }
  }
}

.comments {
  & .commentTitle {
    font-size: var(--subheader);
    font-weight: bold;
  }

  & .comment {
    margin-top: var(--margin-small);
    background: var(--blog-comment-background);
    // border-radius: var(--corner-radius-small);
    padding: var(--padding-small);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;

    .avatar {
      height: 32px;
      min-width: 32px;
      background-color: blue;
      border-radius: 32px;
    }

    .text-wrapper {
      display: flex;
      flex-direction: column;
      padding: 0 16px;

      .name {
        font-size: var(--small);
        font-weight: 600;
        color: var(--grey-color-900);
        cursor: pointer;
      }
    }

    & .actions {
      // display: flex;
      margin-left: auto;
      // gap: var(--margin-small);

      & button:not(.active) {
        --bg: var(--grey-color-500);
        --color: var(--grey-color-800);
      }
    }
  }

  & .newComment {
    // --bg: var(--grey-color-500);
    margin-top: 0.5rem;
  }
}
</style>
