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
        v-if="user.id == blog.user_author?.id"
        size="small"
        icon="edit"
        @click="$emit('clickEdit')"
      >
        Aanpassen
      </Button>
    </ActionButtons>

    <section
      class="image"
      v-if="blog?.banner_id"
      :style="'background:' + imageUrl"
    ></section>
    <section class="content">
      <div class="titles">
        <div>
          <div class="header">{{ blog?.title }}</div>
          <div class="date">{{ Post.formatDate(blog?.created_at) }}</div>
        </div>
        <Avatar :userId="blog?.user_author?.id" fullName />
      </div>
      <div v-html="blog?.htmlContent"></div>
    </section>

    <section v-if="blog.comments_allowed" class="comments">
      <div class="commentTitle">Opmerkingen</div>
      <div class="comment" v-for="comment in comments" :key="comment.id">
        <Avatar :align="'right'" fullName :userId="comment.author">
          <div class="avatarComment">{{ comment.content }}</div>
        </Avatar>
        <div class="actions">
          <Button
            v-if="true"
            size="tiny"
            icon="clear"
            state="destructive"
          ></Button>
        </div>
      </div>
    </section>

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
  </div>
</template>
<script setup lang="ts">
import { Post } from './../../models/post';
import { Comment } from '@/models/comment';
import { PropType, computed } from 'vue';

import Avatar from '@/components/Avatar.vue';
import Button from '@/components/buttons/Button.vue';
import Textarea from '@/components/inputs/Textarea.vue';

const user = useUser();

const props = defineProps({
  blog: {
    type: Object as PropType<Post>,
    required: false,
  },
});

const textAreaRef = ref();
const imageUrl = ref('none');
const comments = ref<Comment[]>([]);
const newComment = ref('');

const comment = async () => {
  if (!newComment.value) return;

  const comment = await Comment.insert(props.blog.id, newComment.value);
  comments.value.push(comment);
  textAreaRef.value?.clearTextarea();
};
const likedState = computed(() => {
  const likedBy = props.blog?.kudos || [];
  if (!user?.value) return 'default';
  if (!likedBy.includes(user.value.id)) return 'default';
  return 'primary';
});
const likes = computed(() => {
  if (!props.blog) return 'kudo';
  if (props.blog.kudos.length == 1) return props.blog.kudos.length + ' kudo';
  return props.blog.kudos.length + ' kudos';
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
  width: 40rem;
  max-width: 90vw;
  margin: 5rem auto;
  display: flex;
  flex-direction: column;
  gap: var(--margin-medium);
}

.image {
  width: 100%;
  height: 15rem;
  border-radius: var(--corner-radius);
  background-size: cover !important;
  background-position: center center !important;
  margin-bottom: var(--spacing-large);
}
.content {
  background: var(--white-color);
  padding: var(--spacing-medium);
  border-radius: var(--corner-radius);
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
  margin-top: var(--spacing-large);
  & .commentTitle {
    font-size: var(--subheader);
    font-weight: bold;
  }

  & .comment {
    margin-top: var(--spacing-small);
    background: var(--white-color);
    border-radius: var(--corner-radius);
    padding: var(--spacing-small);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .avatarUserName:hover {
      text-decoration: underline;
    }

    .avatarComment {
      font-weight: bold;
      font-size: var(--normal);
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
