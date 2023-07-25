<template>
  <q-fab color="blue-10"
    icon="menu"
    direction="down"
    vertical-actions-align="right">
    <q-fab-action color="blue-10" text-color="white"
      @click="$emit('clickMainMenu')"
      icon="menu_book"
      label="Main Menu"
      label-position="left" />
    <q-fab-action color="blue-10" text-color="white"
      @click="$emit('clickUser')"
      icon="person"
      label="User"
      label-position="left" />
    <q-fab-action color="blue-10" text-color="white"
      @click="$emit('clickSearchAnime')"
      icon="travel_explore"
      label="Discover Animes"
      label-position="left" />
    <q-fab-action color="blue-10" text-color="white"
      @click="$emit('clickSearchUser')"
      icon="person_search"
      label="Find Users"
      label-position="left" />
    <q-fab-action color="blue-10" text-color="white"
      @click="$emit('clickLeaderboard')"
      icon="leaderboard"
      label="Leaderboard"
      label-position="left" />
    <q-fab-action color="blue-10" text-color="white"
      @click="$emit('clickLeave')"
      icon="logout"
      label="Leave"
      label-position="left" />
  </q-fab>
</template>

<script setup>

defineEmits({
  clickMainMenu: null,
  clickUser: null,
  clickSearchAnime: null,
  clickSearchUser: null,
  clickLeaderboard: null,
  clickLeave: null,
});

</script>
