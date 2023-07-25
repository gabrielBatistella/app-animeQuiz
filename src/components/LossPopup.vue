<template>
  <q-dialog v-model="model" transition-show="scale" persistent>
    <q-card>
      <q-card-section class="text-center">
        <q-img width="300px" src="/loss.gif" />
      </q-card-section>
      <q-card-section>
        <div class="text-h3 text-center text-red q-my-md">
          It wasn't this time...
        </div>
        <div class="text-h5 text-center">
          But you got what it takes, keep training and you can conquer the leaderboard!
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';

const model = ref(true);

</script>
