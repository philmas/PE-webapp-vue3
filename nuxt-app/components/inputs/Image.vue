<template>
  <div class="imageInput">
    <!-- If there is an image preview -->
    <div
      class="preview"
      v-if="imageUrl != 'none'"
      :style="{ background: imageUrl }"
    >
      <div class="reuploadActions">
        <Button
          size="small"
          icon="delete"
          state="destructive"
          @click="removeImage"
        >
          Afbeelding verwijderen
        </Button>
        <label for="image-reupload">
          <div class="button size-small" :class="{ loading: uploading }">
            <div>
              <i class="material-icons-outlined">cloud_upload</i>
              Andere afbeelding
            </div>
          </div>
        </label>
        <input
          id="image-reupload"
          type="file"
          accept="image/*"
          @change="updateImage"
        />
      </div>
    </div>
    <div v-else>
      <label for="image-upload">
        <div class="button size-small" :class="{ loading: uploading }">
          <div>
            <i class="material-icons-outlined">cloud_upload</i>
            {{ placeholder }}
          </div>
        </div>
      </label>
      <input
        id="image-upload"
        type="file"
        accept="image/*"
        @change="updateImage"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from "vue";
import { Post } from "@/models/Post";
import Button from "@/components/buttons/Button.vue";

const props = defineProps({
  blog: Object as PropType<Post>,
  placeholder: {
    type: String,
    default: "Afbeelding uploaden",
  },
});

const imageUrl = ref<string>("none");
const uploading = ref<boolean>(false);

const updateImage = async (event: Event) => {
  // 0. set button to (up) loading
  uploading.value = true;

  // 1. get file the user wants to upload => if no file selected, return
  const file = (event.target as HTMLInputElement).files[0];
  const fileName = "banner";
  if (!file) {
    uploading.value = false;
    return;
  }

  // 2. upload file to correct directory
  const storage = useStorage();
  const { error } = await storage
    .from("blogs")
    .upload(`${props.blog.id}/${fileName}`, file, {
      cacheControl: "3600",
      upsert: true,
    });
  if (error) {
    uploading.value = false;
    return;
  }

  // 4. update blog post with correct image directory
  const { error: error2 } = await props.blog.endpoint
    .update({ has_banner: true })
    .eq("id", props.blog.id);
  if (error2) {
    uploading.value = false;
    return;
  }

  // 5. update imageUrl
  imageUrl.value = `url(${URL.createObjectURL(file)})`;
  uploading.value = false;
};

const removeImage = async () => {
  const { error } = await props.blog.endpoint
    .update({ has_banner: false })
    .eq("id", props.blog.id);

  if (!error) imageUrl.value = "none";
};

onMounted(async () => {
  const bannerUrl = await props.blog.bannerUrl();
  console.log(bannerUrl);
  if (!bannerUrl) return;
  imageUrl.value = `url(${bannerUrl})`;
});
</script>

<style scoped lang="scss">
.imageInput {
  width: var(--width-large);
  margin: var(--spacing-medium) auto;

  & .preview {
    width: 100%;
    height: 20rem;
    position: relative;
    border-radius: var(--corner-radius);
    background-size: cover !important;
    background-position: center !important;
  }

  & .reuploadActions {
    position: absolute;
    bottom: var(--spacing-medium);
    right: var(--spacing-medium);
    display: flex;
    display: flex;
    gap: var(--spacing-small);
    justify-content: flex-end;
  }
}

label .button {
  line-height: 2.45rem;
}

input {
  display: none;
}
</style>
