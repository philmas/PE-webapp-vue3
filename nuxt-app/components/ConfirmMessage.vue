<template>
  <div class="confirmMessage">
    <div class="confirmTitle">{{ message.title }}</div>
    <div class="confirmContent">{{ message.content }}</div>
    <div class="confirmButtons">
      <slot>
        <Button
          v-if="message.hasCancelButton"
          size="small"
          state="destructive"
          @click="$removeConfirmMessage(message)"
          >{{ message?.cancelButtonText || 'Nee' }}</Button
        >
        <Button
          v-if="message.rejectButton"
          size="small"
          state="destructive"
          @click="message.rejectButton.action"
          >{{ message.rejectButton.text }}</Button
        >
        <Button
          v-if="message.acceptButton"
          size="small"
          @click="message.acceptButton.action"
          >{{ message.acceptButton.text }}</Button
        >
      </slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Message } from './../models/confirmMessage';
import Button from './Button.vue';

defineProps<{ message: Message }>();
</script>

<style scoped lang="scss">
.confirmMessage {
  padding: var(--padding-large);
  background: #ffffffab;
  backdrop-filter: blur(7px) saturate(2);
  width: 100%;
  border-radius: var(--corner-radius);
  margin-top: var(--margin-large);

  & .confirmTitle {
    font-size: var(--subtitle);
    font-weight: bold;
    color: var(--primary-color-900);
  }

  & .confirmContent {
    font-size: var(--small);
    color: var(--grey-color-700);
  }

  & .confirmButtons {
    width: 100%;
    display: flex;
    margin-top: var(--margin-tiny);
    justify-content: flex-end;
    gap: var(--margin-large);
  }
}
</style>
