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
    <ActionButtons rightAlign bottom>
      <Button
        v-if="blog.comments_allowed"
        size="small"
        :state="likedState"
        icon="celebration"
      >
        {{ likes }}
      </Button>
      <Button size="small" icon="reply" @click="comment">Reageer</Button>
    </ActionButtons>
  </div>
</template>
<script setup lang="ts">
import { Post } from './../../models/post';
import { PropType, computed } from 'vue';
import Avatar from './../Avatar.vue';
import Button from './../buttons/Button.vue';

const user = useUser();

const props = defineProps({
  blog: {
    type: Object as PropType<Post>,
    required: false,
  },
});

const textAreaRef = ref();
const imageUrl = ref('none');

const comment = async () => {
  // TODO: added comment to blog
  console.log('comment');
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
  const storage = useStorage();
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
</style>
