<template>
  <div>
    <NavigationBar>
      <template #menu> </template>
    </NavigationBar>

    <Login v-if="!user" />
    <slot v-else></slot>

    <div class="confirmationMessages" v-if="$confirmMessages">
      <ConfirmMessage
        v-for="message in $confirmMessages.value"
        :message="message"
      />
    </div>
  </div>
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
import NavigationBar from '@/components/NavigationBar.vue';

const user = useUser();
</script>

<style scoped lang="scss">
.confirmationMessages {
  position: fixed;
  bottom: 5vw;
  right: 5vw;
  width: 20rem;
  max-width: 90vw;
  z-index: 101;
}
</style>
