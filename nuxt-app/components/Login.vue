<template>
  <Modal>
    <template #header>Welkom bij de Proteus-Eretes App</template>
    <!-- TODO: Add text for users who have not logged in before -->
    <form @submit.prevent="login">
      <Input class="input" size="medium" label="Email" v-model="email" />

      <Button
        state="primary"
        size="small"
        :loading="loading"
        @click.self="login"
      >
        Aanmelden
      </Button>

      <div v-if="error" class="error">{{ error }}</div>
    </form>
  </Modal>
</template>

<script setup lang="ts">
import Button from "./buttons/Button.vue";
import Input from "./inputs/Input.vue";
import Modal from "./Modal.vue";

const auth = useAuth();

const email = ref("");
const error = ref("");
const loading = ref(false);

const login = async (e: Event) => {
  if (!e || e.type != "submit" || !loading) return;
  loading.value = true;

  const { error: supabaseError } = await auth.signIn({
    email: email.value,
  });

  if (supabaseError?.message) {
    error.value = supabaseError.message;
    return;
  }

  error.value = "";
  loading.value = false;
};
</script>

<style scoped lang="scss">
form {
  display: flex;
  flex-direction: column;
  gap: 16px 0;
}
</style>
