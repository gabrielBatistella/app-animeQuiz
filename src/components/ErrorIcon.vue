<template>
  <div class="text-center q-pa-xl">
    <q-img
    width="300px"
    src="/error.gif" />
    <div class="text-subtitle2 q-mt-xl">
      {{ msg }}
    </div>
  </div>
</template>

<script setup>

defineProps({
  msg: {
    type: String,
    default() {
      return 'Something is wrong! :-(';
    },
  },
});

</script>
