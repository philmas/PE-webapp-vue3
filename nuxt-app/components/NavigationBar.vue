<template>
  <div class="wrapper">
    <div class="navigationBar">
      <NuxtLink to="./">
        <div class="logo"></div>
      </NuxtLink>
      <Avatar
        v-if="$user?.value"
        :src="$user.value.getPhotoUrl()"
        @click="toggleMenu"
        :name="$user.value.fullName"
      />
    </div>

    <Modal v-if="menu" @close="closeMenu">
      <template #header> Header </template>
      <Button size="large" @click="signOut"> signOut</Button>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Avatar from "./Avatar.vue";
import Modal from ".//Modal.vue";

const nuxtApp = useNuxtApp();
const menu = ref(false);

const toggleMenu = (e: Event) => {
  if (!e) return;

  menu.value = !menu.value;
};

const closeMenu = () => {
  menu.value = false;
};

const signOut = (e: Event) => {
  if (!e) return;

  nuxtApp.$signOut();
  closeMenu();
};
</script>

<style scoped lang="scss">
.wrapper {
  --padding-ver: 1rem;
  --padding-hor: min(2rem, 5vw);
  --height: 56px;
  position: relative;
  height: var(--height);
}

.navigationBar {
  position: fixed;
  height: var(--height);
  width: 100vw;
  padding: var(--padding-ver) var(--padding-hor);
  top: 0;
  left: 0;
  background: var(--navigation-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 101;
  backdrop-filter: blur(7px) saturate(2);
  box-shadow: 0 0 0 1px rgba(9, 9, 9, 0.1);

  & > a {
    width: 100%;

    & .logo {
      height: 2rem;
      width: 100%;
      background: url(/logo.svg);
      background-size: contain;
      background-position: left;
      background-repeat: no-repeat;
    }
  }
}
</style>
