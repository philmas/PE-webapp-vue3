<template>
  <div>
    <ActionButtons>
      <Button
        size="small"
        state="primary"
        icon="arrow_back"
        :loading="backToMyPostsLoading"
        @click="backToMyPosts"
      >
        Terug naar blogs
      </Button>
    </ActionButtons>

    <Image v-if="openedPost" :blog="openedPost" />

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
      <Button
        size="small"
        state="primary"
        icon="edit"
        @click="publishModal = true"
      >
        Publiceren
      </Button>
    </ActionButtons>

    <Modal v-if="publishModal" @close="publishModal = false">
      <template #header>Publiceren</template>

      {{ publishDateTime }}
      <Input type="date" v-model="publishDate" />
      <Input type="time" v-model="publishTime" />

      <Button size="small" state="primary" icon="edit" @click="publishPost">
        Publiceren
      </Button>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import ActionButtons from '@/components/buttons/ActionButtons.vue';
import Button from '@/components/buttons/Button.vue';
import Image from '@/components/inputs/Image.vue';
import Input from '@/components/inputs/Input.vue';

import Texteditor from '@/components/inputs/Texteditor.vue';
import { Message } from '~~/models/confirmMessage';

import { Post } from '~~/models/post';

const nuxtApp = useNuxtApp();
const openedPost = ref<Post>();
const imageUrl = ref<string>('none');
const backToMyPostsLoading = ref(false);

const publishModal = ref(true);
const publishDateTime = ref<Date>(new Date());

const publishDate = computed<string>({
  get() {
    const date = publishDateTime.value.toISOString().split('T')[0];
    return date;
  },
  set(value: string) {
    const split = value.split('-');
    const date = new Date(publishDateTime.value);

    if (split.length >= 3) {
      const year = Number(split[0]);
      const month = Number(split[1]) - 1;
      const day = Number(split[2]);
      date.setFullYear(year);
      date.setMonth(month);
      date.setDate(day);
    }

    publishDateTime.value = date;
  },
});
const publishTime = computed<string>({
  get() {
    const timeString = publishDateTime.value.toTimeString();
    return timeString.split(' ')[0];
  },
  set(value: string) {
    const split = value.split(':');
    const date = new Date(publishDateTime.value);

    if (split.length >= 2) {
      const hours = Number(split[0]);
      const minutes = Number(split[1]);

      date.setHours(hours);
      date.setMinutes(minutes);
    }
    if (split.length >= 3) {
      const seconds = Number(split[2]);
      date.setSeconds(seconds);
    }

    publishDateTime.value = date;
  },
});

const backToMyPosts = async () => {
  backToMyPostsLoading.value = true;
  await save();
  nuxtApp.$router.push('/mijnposts');
  backToMyPostsLoading.value = false;
};

const save = async (savePublishDate = false) => {
  if (!openedPost?.value) return;
  const post = openedPost.value;
  const supabase = useSupabase();

  const updatedPost: any = {
    title: post.title,
    content: post.content,
  };

  if (savePublishDate)
    updatedPost.publish_date = publishDateTime.value.toISOString();

  await supabase.from('News_items').update(updatedPost).eq('id', post.id);
};

const publishPost = async () => {
  const { $router } = useNuxtApp();

  await save(true);
  const dateTime = new Date(publishDateTime.value);
  const now = new Date();

  // If dateTime published is larger than now => post will be published in the future
  if (dateTime > now) $router.push('/mijnposts');
  else $router.push('/');
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

    if (openedPost.value.publish_date) {
      publishDateTime.value = new Date(openedPost.value.publish_date);
    }

    const bannerUrl = await openedPost.value.bannerUrl();
    if (!bannerUrl) return;
    imageUrl.value = `url(${bannerUrl})`;
  } catch (error) {
    console.log(error);
  }
});

onUnmounted(async () => {
  console.log('save');
  await save();
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
