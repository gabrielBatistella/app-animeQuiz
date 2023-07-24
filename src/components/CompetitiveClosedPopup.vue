<template>
  <q-dialog v-model="model" transition-show="scale" persistent>
    <q-card>
      <q-card-section>
        <div class="text-h6 text-center">
          This competitive match has ended!
        </div>
      </q-card-section>
      <q-card-section class="text-center">
        <q-img width="100px" src="/error.gif" />
      </q-card-section>
      <q-card-section class="q-px-lg">
        <div class="text-body2 text-center">
          The time period for this match has ended.<br>
          The anime of the day has changed,
          you can access the new competitive match from the Main Menu.
        </div>
      </q-card-section>
      <q-card-actions align="center">
        <q-btn flat label="Main Menu" color="blue-10" @click="router.push('/home')" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const model = ref(true);

</script>
