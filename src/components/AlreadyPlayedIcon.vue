<template>
  <div class="text-center absolute-center">
    <q-img width="300px" src="/error.gif" />
    <div class="text-center q-mt-xl">
      <span class="text-blue-10">
        Seems like you've already played the competitive match today!<br>
        If you're still eager for some more Anime Quiz, you can always play in Casual Mode.
      </span>
      <q-btn label="Return to Main Menu" color="blue-10" @click="router.push('/home')" />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

</script>
