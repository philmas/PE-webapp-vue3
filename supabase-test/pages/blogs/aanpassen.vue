<template>
  <div>
    <ActionButtons>
      <Button
        size="small"
        state="primary"
        icon="arrow_back"
        @click="$router.push('/mijnposts')"
      >
        Terug naar blogs
      </Button>
    </ActionButtons>

    <div
      v-if="openedPost?.banner_id"
      class="image"
      :style="{ background: imageUrl }"
    >
      <Button class="uploadButton" size="small" icon="file_upload">
        Andere afbeelding...
      </Button>
    </div>

    <input
      v-if="openedPost"
      placeholder="Titel"
      class="title"
      type="text"
      v-model="openedPost.title"
    />

    <Texteditor v-if="openedPost" v-model="openedPost.content" />

    <ActionButtons v-if="openedPost" right-align bottom>
      <Button
        size="small"
        state="destructive"
        icon="delete"
        @click="deletePost"
      >
        Verwijderen
      </Button>
      <Button size="small" icon="cloud_upload" @click="save"> Opslaan </Button>
      <Button size="small" state="primary" icon="edit"> Publiceren </Button>
    </ActionButtons>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import ActionButtons from '@/components/buttons/ActionButtons.vue';
import Texteditor from '@/components/inputs/Texteditor.vue';
import { Message } from '~~/models/confirmMessage';

import { Post } from '@/models/post';

const nuxtApp = useNuxtApp();
const openedPost = ref<Post>();
const imageUrl = ref<string>('none');

const save = async () => {
  if (!openedPost?.value) return;
  const post = openedPost.value;
  const supabase = useSupabase();

  await supabase
    .from('News_items')
    .update({
      title: post.title,
      content: post.content,
    })
    .eq('id', post.id);
};

const deletePost = () => {
  if (!openedPost?.value) return;
  const supabase = useSupabase();

  const { $router, $removeConfirmMessage, $addConfirmMessage } = useNuxtApp();

  const confirmMessage: Message = {
    title: 'Heel zeker?',
    content: 'Weet je zeker dat je deze blog wilt verwijderen?',
    hasCancelButton: true,
    cancelButtonText: 'Niet verwijderen',
    acceptButton: {
      text: 'Ja heel zeker!',
      action: async () => {
        const { error } = await supabase
          .from('News_items')
          .delete()
          .eq('id', openedPost.value.id);

        if (!error) $router.push('/mijnposts');
        $removeConfirmMessage(confirmMessage);
      },
    },
  };

  $addConfirmMessage(confirmMessage);
};

onMounted(async () => {
  const cardId = nuxtApp.$router.currentRoute.value.query?.id;
  const user = useUser();

  if (!cardId) {
    openedPost.value = undefined;
    return;
  }

  try {
    openedPost.value = await Post.fetch(parseInt(cardId), (query) =>
      query.eq('user_author', user.value.id)
    );

    const bannerUrl = await openedPost.value.bannerUrl();
    if (!bannerUrl) return;
    imageUrl.value = `url(${bannerUrl})`;
  } catch (error) {
    console.log(error);
  }
});
</script>

<style scoped lang="scss">
.title {
  font-size: var(--title);
  width: var(--width-large);
  max-width: var(--max-width);
  padding: var(--spacing-small);
  margin: 0 auto;
  display: block;
  border: 1px solid var(--grey-color-900);
  border-radius: var(--corner-radius);
}

.image {
  width: var(--width-large);
  max-width: var(--max-width);
  height: 15rem;
  background-size: cover !important;
  background-position: center !important;
  margin: var(--spacing-medium) auto;
  border-radius: var(--corner-radius);
  position: relative;

  & .uploadButton {
    position: absolute;
    right: var(--spacing-medium);
    bottom: var(--spacing-small);
  }
}
</style>
