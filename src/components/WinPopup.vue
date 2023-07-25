<template>
  <q-dialog v-model="model" transition-show="scale" persistent>
    <q-card>
      <q-card-section class="text-center">
        <q-img width="300px" src="/win.gif"/>
      </q-card-section>
      <q-card-section>
        <div class="text-h3 text-center text-green q-my-md">
          Congratulations!!
        </div>
        <div v-if="numOfAttempts != null" class="text-h4 text-center">
          You got it right in {{ numOfAttempts }} attempts!
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  numOfAttempts: {
    type: Number,
    default() {
      return null;
    },
  },
});

const model = ref(true);

</script>
