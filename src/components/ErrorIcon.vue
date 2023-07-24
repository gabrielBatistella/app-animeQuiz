<template>
  <div class="text-center absolute-center">
    <q-img width="300px" src="/error.gif" />
    <div class="text-center q-mt-xl">
      <span :class="`text-${textColor} text-h6`">
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
      return 'Something is wrong! :-(';
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
