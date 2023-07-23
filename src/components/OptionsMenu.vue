<template>
  <q-fab color='blue-10' glossy
    icon='menu'
    direction='down'
    vertical-actions-align='right'>
    <q-fab-action color='blue-10' text-color='white'
      @click='$emit("clickUser")'
      icon='person'
      label='User'
      label-position='left' />
    <q-fab-action color='blue-10' text-color='white'
      @click='$emit("clickLeaderboards")'
      icon='leaderboard'
      label='Leaderboard'
      label-position='left' />
    <q-fab-action color='blue-10' text-color='white'
      @click='$emit("clickLeave")'
      icon='logout'
      label='Leave'
      label-position='left' />
  </q-fab>
</template>

<script setup>

defineEmits({
  clickUser: null,
  clickLeaderboards: null,
  clickLeave: null,
});

</script>
