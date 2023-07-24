<template>
  <div class="text-center absolute-center">
    <q-img width="300px" src="/error.gif" />
    <div class="text-center q-mt-xl">
      <span :class="`text-${textColor}`">
        {{ msg }}
      </span>
    </div>
  </div>
</template>

<script setup>

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

</script>
