<template>
  <div>
    <ActionButtons rightAlign>
      <Button
        size="small"
        state="primary"
        icon="add"
        @click="$router.push('/cards/nieuweblog')"
      >
        Nieuw bericht
      </Button>
    </ActionButtons>

    <InfiniteList>
      <template #default="post">
        <BlogPost :blog="post" />
      </template>

      <template #loading> loading </template>
    </InfiniteList>
  </div>
</template>

<script setup lang="ts">
import Button from '@/components/buttons/Button.vue';
import BlogPost from '@/components/blogs/BlogPost.vue';

const user = useUser();
const auth = useAuth();
</script>
