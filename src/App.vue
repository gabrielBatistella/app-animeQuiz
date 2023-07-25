<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script setup>
import { onMounted } from 'vue';
import { useStore } from 'src/stores/dbStore';

const store = useStore();
const {
  defineAnimeOfTheDay,
} = store;

onMounted(() => {
  defineAnimeOfTheDay().catch(() => {});
});
</script>
