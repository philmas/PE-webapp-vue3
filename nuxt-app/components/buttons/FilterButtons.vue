<template>
  <div class="filterButtons">
    <Filter icon="article">Blogs</Filter>
    <Filter icon="event">Eetlijsten</Filter>
    <Filter icon="poll">Polls</Filter>
    <Filter icon="perm_media">Media</Filter>
  </div>
</template>

<script setup lang="ts">
// import { Blog } from "./../../models/posts/blogs";
import { PropType } from "vue";
import Filter from "@/components/inputs/Filter.vue";
// import Texteditor from "./../inputs/Texteditor.vue";
</script>

<style scoped lang="scss">
.filterButtons {
  box-shadow: 0 0 0 1px rgba(9, 9, 9, 0.1);
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
