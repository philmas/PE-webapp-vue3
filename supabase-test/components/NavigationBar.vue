<template>
  <div class="wrapper">
    <div class="navigationBar">
      <div class="logo"></div>
      <div @click="toggleMenu">
        <Avatar v-if="user" :name="user.id" />
      </div>
    </div>

    <Modal v-if="menu" @close="closeMenu">
      <template #header> Uitloggen </template>
      <Button size="large" @click="logOut"> Uitloggen</Button>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

import Button from './buttons/Button.vue';
import Avatar from './Avatar.vue';
import Modal from './/Modal.vue';

const user = useUser();
const menu = ref(false);

const { signOut } = useAuth();

const toggleMenu = (e: Event) => {
  if (!e) return;
  console.log(menu.value);

  menu.value = !menu.value;
};

const closeMenu = () => {
  menu.value = false;
};

const logOut = async (e: Event) => {
  if (!e) return;

  await signOut();
  closeMenu();
};
</script>

<style scoped lang="scss">
.wrapper {
  --spacing-ver: var(--spacing-medium);
  --spacing-hor: min(--spacing-huge, 5vw);
  --navigationbar-height: 5rem;
  --navigation-background: rgba(255, 255, 255, 0.9);

  position: relative;
  height: var(--navigationbar-height);
  margin-bottom: var(--spacing-huge);
}

.navigationBar {
  position: fixed;
  height: var(--navigationbar-height);
  width: 100vw;
  padding: var(--spacing-ver) var(--spacing-hor);
  top: 0;
  left: 0;
  background: var(--navigation-background);
  display: flex;
  justify-content: space-between;
  align-items: center;
  z-index: 101;
  backdrop-filter: blur(7px) saturate(2);

  & .logo {
    height: 3rem;
    width: 100%;
    background: url(/logo.svg);
    background-size: contain;
    background-position: left;
    background-repeat: no-repeat;
  }
}
</style>
