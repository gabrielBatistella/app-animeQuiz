<template>
  <div class="text-center absolute-center">
    <q-circular-progress
      indeterminate
      :size="size"
      :color="color"
      class="q-ma-md">
    </q-circular-progress>
    <div class="text-center">
      <span :class="`text-${textColor}`">{{ msg }}</span>
    </div>
  </div>
</template>

<script setup>

defineProps({
  msg: {
    type: String,
    default: 'Loading Page...',
  },
  size: {
    type: String,
    default: '100px',
  },
  color: {
    type: String,
    default() {
      return 'primary';
    },
  },
  textColor: {
    type: String,
    default() {
      return 'primary';
    },
  },
});

</script>
