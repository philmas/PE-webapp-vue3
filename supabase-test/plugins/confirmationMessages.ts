import { defineNuxtPlugin } from '#app';
import { Message } from './../models/confirmMessage';

const messages = ref<Message[]>([]);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      confirmMessages: readonly(messages),
      addConfirmMessage: (message: Message) => {
        messages.value.push(message);
        //TODO: add timeout before removing message
      },
      removeConfirmMessage: (message: Message) => {
        messages.value = messages.value.filter(
          (m) => m.title !== message.title
        );
      },
    },
  };
});
