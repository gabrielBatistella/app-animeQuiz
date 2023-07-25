<template>
  <div class="text-center absolute-center">
    <q-img width="300px" :src="gif" />
    <div class="text-center q-mt-xl">
      <span :class="`text-${textColor}`">
        {{ msg }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

defineProps({
  msg: {
    type: String,
    default() {
      return 'Loading Page...';
    },
  },
  textColor: {
    type: String,
    default() {
      return 'blue-10';
    },
  },
});

const gif = ref('');

function init() {
  const gifs = ['/loading1.gif', '/loading2.gif', '/loading3.gif'];
  gif.value = gifs[Math.floor(Math.random() * 3)];
}

onMounted(init);

</script>
