import { defineNuxtPlugin } from '#app';
import { Message } from './../models/confirmMessage';

const messages = ref<Message[]>([]);

export default defineNuxtPlugin(() => {
  return {
    provide: {
      confirmMessages: readonly(messages),
      addConfirmMessage: (message: Message) => {
        messages.value.push(message);

        // Remove message (not very efficiently) from list of messages after 7 seconds
        setTimeout(() => {
          messages.value = messages.value.filter(
            (m) => m.content != message.content && m.title != message.title
          );
        }, 7000);
      },
      removeConfirmMessage: (message: Message) => {
        messages.value = messages.value.filter(
          (m) => m.title !== message.title
        );
      },
    },
  };
});
