<template>
  <div class="BlogOpenWrapper">
    <ActionButtons>
      <Button
        size="small"
        state="primary"
        icon="arrow_back"
        @click="$router.push('/')"
      >
        Terug naar nieuwsfeed
      </Button>
      <Button
        v-if="blog.isOwner()"
        size="small"
        icon="edit"
        @click="$router.push('/blogs/aanpassen?id=' + blog.id)"
      >
        Aanpassen
      </Button>
    </ActionButtons>
    <div class="container">
      <section
        class="image"
        v-if="blog?.has_banner"
        :style="'background:' + imageUrl"
      ></section>
      <section class="content">
        <div class="header">
          <div class="titles">
            <div class="title">{{ blog?.title }}</div>
            <div class="date">{{ Post.formatDate(blog?.publish_date) }}</div>
          </div>
          <Avatar :userId="blog?.user_author_id" fullName />
        </div>
        <div class="text" v-html="blog?.htmlContent"></div>
      </section>

      <section v-if="blog.comments_allowed" class="comments">
        <div class="commentTitle">Opmerkingen</div>
        <div class="comment" v-for="comment in comments" :key="comment.id">
          <Avatar :align="'right'" fullName :userId="comment.author">
            <div class="avatarComment">{{ comment.content }}</div></Avatar
          >

          <div class="actions">
            <Button
              v-if="true"
              size="tiny"
              icon="clear"
              state="destructive"
            ></Button>
          </div>
        </div>
        <div class="newComment">
          <Textarea
            size="large"
            placeholder="Schrijf een nieuwe reactie"
            :minRows="2"
            ref="textAreaRef"
            v-model="newComment"
          ></Textarea>
        </div>
        <ActionButtons v-if="blog.comments_allowed" rightAlign bottom>
          <Button size="small" :state="likedState" icon="celebration">
            {{ likes }}
          </Button>
          <Button
            size="small"
            :state="newComment ? 'default' : 'disabled'"
            icon="reply"
            @click="comment"
            >Reageer
          </Button>
        </ActionButtons>
      </section>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Post } from "@/models/post";
import { Comment } from "@/models/comment";
import { PropType, computed } from "vue";

import Avatar from "@/components/Avatar.vue";
import Button from "@/components/buttons/Button.vue";
import Textarea from "@/components/inputs/Textarea.vue";

const user = useUser();

const props = defineProps({
  blog: {
    type: Object as PropType<Post>,
    required: false,
  },
});

const textAreaRef = ref();
const imageUrl = ref("none");
const comments = ref<Comment[]>([]);
const newComment = ref("");

const comment = async () => {
  if (!newComment.value) return;

  const comment = await Comment.insert(props.blog.id, newComment.value);
  comments.value.push(comment);
  textAreaRef.value?.clearTextarea();
};
const likedState = computed(() => {
  const likedBy = props.blog?.kudos || [];
  if (!user?.value) return "default";
  if (!likedBy.includes(user.value.id)) return "default";
  return "primary";
});
const likes = computed(() => {
  if (!props.blog) return "kudo";
  if (props.blog.kudos.length == 1) return props.blog.kudos.length + " kudo";
  return props.blog.kudos.length + " kudos";
});

onMounted(async () => {
  if (!props.blog) return;
  const fetchedComments = await props.blog.fetchComments();
  comments.value = fetchedComments;

  const bannerUrl = await props.blog.bannerUrl();
  if (!bannerUrl) return;
  imageUrl.value = `url(${bannerUrl})`;
});
</script>

<style lang="scss" scoped>
.BlogOpenWrapper {
  width: 768px;
  max-width: 90vw;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-medium);

  .container {
    margin: 32px 0;
  }
}

.image {
  width: 100%;
  height: 15rem;
  border-radius: 24px 24px 0 0;
  background-size: cover !important;
  background-position: center center !important;
  margin-bottom: var(--spacing-large);
}
.content {
  background: var(--white-color);
  padding: 32px 48px;
  border-radius: 0 0 24px 24px;
  & .header {
    margin-bottom: var(--blog-header-bottom-margin);
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    & .title {
      grid-area: title;
      font-size: 30px;
      font-weight: var(--blog-title-font-weight);
      margin-bottom: 4px;
    }
    & .date {
      grid-area: date;
      color: var(--blog-date-font-color);
      font-size: 16px;
      font-weight: var(--blog-date-font-weight);
    }
  }

  & .text {
    font-weight: 300;
    font-size: 18px;
    line-height: 30px;
  }
}

.comments {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px 0;
  & .commentTitle {
    font-size: 20px;
    font-weight: bold;
  }

  & .comment {
    // margin-top: var(--spacing-small);
    background: var(--white-color);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatar {
      align-items: flex-start;
      font-weight: bold;
    }
    .avatarUserName:hover {
      text-decoration: underline;
    }

    .avatarComment {
      font-weight: 400;
      font-size: 16px;
    }

    & .actions {
      display: flex;
      margin-left: auto;
      gap: var(--spacing-small);

      & button:not(.active) {
        --bg: var(--grey-color-500);
        --color: var(--grey-color-800);
      }
    }
  }
}

.newComment {
  margin-top: var(--spacing-small);
}
</style>
