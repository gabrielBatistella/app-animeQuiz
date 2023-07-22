<template>
  <div class="text-center">
    <q-circular-progress
      indeterminate
      :size="size"
      color="primary"
      class="q-ma-md">
    </q-circular-progress>
    <div>
      {{ msg }}
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  msg: {
    type: String,
    default: 'Loading page...',
  },
  size: {
    type: String,
    default: '25vw',
  },
});

</script>
