<template>
  <div>
    <section class="actionButtons">
      <Button
        size="small"
        state="primary"
        icon="arrow_back"
        @click="$emit('back')"
      >
        Terug naar blogs
      </Button>

      <!--TODO: add this capibility -->
      <Button
        v-if="false"
        size="small"
        icon="edit"
        @click="log('open popup toegang aanpassen')"
        >Toegang aanpassen</Button
      >
    </section>

    <div class="image" :style="'background: url(' + blog?.getPhotoUrl() + ')'">
      <Button
        class="uploadButton"
        size="small"
        icon="file_upload"
        @click="log('upload new image')"
      >
        Andere afbeelding...
      </Button>
    </div>

    <Texteditor v-model="rawText" />

    <section class="actionButtons bottomActions">
      <Button
        size="small"
        state="destructive"
        icon="delete"
        @click="$emit('delete')"
      >
        Verwijderen
      </Button>

      <Button
        v-if="false"
        size="small"
        icon="cloud_upload"
        @click="log('opslaan')"
      >
        Opslaan
      </Button>
      <Button size="small" state="primary" icon="edit" @click="$emit('publish')"
        >Publiceren</Button
      >
    </section>
  </div>
</template>

<script setup lang="ts">
import { Blog } from "./../../models/posts/blogs";
import { PropType } from "vue";
import Texteditor from "./../inputs/Texteditor.vue";

const props = defineProps({
  blog: {
    type: Object as PropType<Blog>,
    required: true,
  },
});

// Make typescript aware of the emits
defineEmits<{
  (e: "back"): void;
  (e: "delete"): void;
  (e: "publish"): void;
}>();

const rawText = ref(props.blog.getRawData());

const log = (log: string) => console.log(log);
</script>

<style scoped lang="scss">
.actionButtons {
  width: var(--width-large);
  margin: 1rem auto 0;
  max-width: 90vw;
  display: flex;
  flex-wrap: wrap;
  gap: var(--margin-small);

  &.bottomActions {
    justify-content: end;
    margin-bottom: 5rem;
  }
}

.image {
  width: var(--width-large);
  max-width: 90vw;
  height: 15rem;
  background-size: cover !important;
  background-position: center !important;
  margin: 0.5rem auto;
  border-radius: var(--corner-radius);
  position: relative;

  & .uploadButton {
    position: absolute;
    right: 1rem;
    bottom: 0.75rem;
  }
}
</style>
