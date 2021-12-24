<template>
  <div>
    <div class="editor" contenteditable="true" @input="updateJson">content</div>
    <div class="jsonContent">{{ jsonData }}</div>
    <pre class="jsonContent">{{ JSON.stringify(jsonData, null, 2) }}</pre>
  </div>
</template>

<script setup lang="ts">
import { generateJSON } from '@tiptap/core';
import StarterKit from '@tiptap/starter-kit';

const jsonData = ref({});

const updateJson = (e: Event) => {
  const target = e.target as HTMLDivElement;
  const html = target.innerHTML;

  jsonData.value = generateJSON(html, [StarterKit]);
};
</script>

<style scoped>
.editor,
.jsonContent {
  height: 20rem;
  background: var(--grey-color-900);
  color: var(--grey-color-100);
  padding: var(--spacing-large);
  margin: 1rem auto;
  width: var(--width-large);
  border-radius: var(--corner-radius);
  overflow: auto;
}
</style>
