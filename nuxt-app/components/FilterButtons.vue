<template>
  <div class="filterButtons">
    <Filter icon="article">Blogs</Filter>
    <Filter icon="event">Eetlijsten</Filter>
    <Filter icon="poll">Polls</Filter>
    <Filter icon="perm_media">Media</Filter>
  </div>
</template>

<script setup lang="ts">
import { Blog } from "./../../models/posts/blogs";
import { PropType } from "vue";
import Texteditor from "./../inputs/Texteditor.vue";
import Filter from "./inputs/Filter.vue";
</script>

<style scoped lang="scss">
.filterButtons {
  outline: 2px solid var(--grey-color-400);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: white;
  border-radius: 24px;
  // height: 40px;
  // width: 680px;
}
</style>
