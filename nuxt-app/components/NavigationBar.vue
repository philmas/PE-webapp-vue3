<template>
  <div class="wrapper">
    <div class="navigationBar">
      <div class="logo"></div>
      <div @click="toggleMenu">
        <Avatar v-if="user" :userId="user.id" />
      </div>
    </div>

    <Modal v-if="menu" @close="closeMenu">
      <template #header> Uitloggen </template>
      <Button size="large" @click="logOut"> Uitloggen</Button>
    </Modal>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import Button from "@/components/buttons/Button.vue";
import Avatar from "@/components/Avatar.vue";
import Modal from "@/components/Modal.vue";

const user = useUser();
const menu = ref(false);

const { signOut } = useAuth();

const toggleMenu = (e: Event) => {
  if (!e) return;

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
  --padding-ver: 1rem;
  --padding-hor: min(2rem, 5vw);
  --height: 56px;
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
  box-shadow: 0 0 0 1px rgba(9, 9, 9, 0.1);

  & .logo {
    height: 2rem;
    width: 100%;
    background: url(/logo.svg);
    background-size: contain;
    background-position: left;
    background-repeat: no-repeat;
  }
}
</style>
