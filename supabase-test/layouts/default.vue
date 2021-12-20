<template>
  <div>
    <Login v-if="!user" />
    <slot v-else></slot>
  </div>
  <!-- <NavigationBar>
    <template #menu> </template>
  </NavigationBar> -->

  <!-- <div class="confirmationMessages" v-if="$confirmMessages">
    <ConfirmMessage
      v-for="message in $confirmMessages.value"
      :message="message"
    />
  </div> -->
</template>

<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
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
