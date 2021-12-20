<template>
  <Modal>
    <template #header></template>
    <div class="login-form">
      <form @submit.prevent="login">
        <Input size="medium" label="Email" v-model="email" />
        <Input
          size="medium"
          label="Wachtwoord"
          type="password"
          v-model="password"
        />
        <div class="buttons">
          <Button state="link" size="tiny">Reset wachtwoord</Button>
          <Button state="primary" size="small" :loading="loading" @click="login"
            >Login</Button
          >
        </div>
        <div v-if="error" class="error">{{ error }}</div>
      </form>
    </div>
  </Modal>
</template>

<script setup lang="ts">
import Modal from './Modal.vue';
import Input from './inputs/Input.vue';
import Button from './Button.vue';

const { $signIn } = useNuxtApp();

const loading = ref(false);
const email = ref('');
const password = ref('');
const error = ref('');

const login = async (e: Event) => {
  if (!e || e.type != 'submit' || !loading) return;

  loading.value = true;
  const { data } = await $signIn(email.value, password.value);
  error.value = data.error || '';
  loading.value = false;
};
</script>

<style lang="scss">
.error {
  color: var(--error-color);
  font-size: var(--small);
  margin-top: var(--spacing-tiny);
  text-align: right;
}

.login-form {
  display: flex;
  justify-content: center;
  .buttons {
    margin-top: var(--spacing-huge);
    display: flex;
    justify-content: space-between;
  }
  button {
    width: 110px;
  }
  form {
    min-width: var(--login-width);
  }
}
</style>
