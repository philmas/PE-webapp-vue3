<template>
  <div class="commentWrapper">
    <div class="comment">
      <div class="content">{{ comment.comment }}</div>
      <NuxtLink class="postedBy" :to="comment.poster.userId">{{
        comment.poster.firstName
      }}</NuxtLink>
    </div>
    <div class="actions">
      <ion-icon icon="retu rn-down-back-outline" />
      <ion-icon icon="thumbs-up-outline" />
      <ion-icon v-if="true" class="iconClose" icon="trash-outline" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Comment } from './../models/posts/comment';

const props = defineProps<{
  comment: Comment;
}>();
</script>

<style scoped lang="scss">
.commentWrapper {
  width: 100%;
  margin-bottom: 1rem;
  background: var(--grey-color-200);
  border-radius: var(--corner-radius);
  padding: var(--spacing-large);
  color: var(--grey-color-900);
  display: flex;
  align-items: center;

  & .comment {
    width: 100%;
    & .postedBy {
      color: var(--grey-color-700);
      font-size: var(--small);
    }
  }

  & .actions {
    font-size: var(--header);
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--grey-color-700);

    & ion-icon:hover {
      color: var(--grey-color-900);
    }

    & .iconClose {
      color: var(--secondary-color-700);

      &:hover {
        color: var(--secondary-color-900);
      }
    }
  }
}
</style>
