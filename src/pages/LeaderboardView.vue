<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <LoadingIcon v-else-if="loading" msg="Loading Leaderboard..." />
    <LeaderboardInfo v-else :users="topUsers" :myRank="myRank" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
// import { storeToRefs } from 'pinia';

import ErrorIcon from 'src/components/ErrorIcon.vue';
import LoadingIcon from 'src/components/LoadingIcon.vue';
import LeaderboardInfo from 'src/components/LeaderboardInfo';

// const route = useRoute();
// const router = useRouter();
const store = useStore();

const {
  getAllUsers,
  assignActionOnUsersChange,
} = store;

// Control attributes:
const error = ref(false);
const loading = ref(true);
const msgError = ref('');

const topUsers = ref([]);
const myRank = ref([]);

function calculateWinPercent(user) {
  const value = user.compStats.numWins
  / (user.compStats.numWins + user.compStats.numLosses);
  return (!Number.isNaN(value)) ? value : '---';
}

function calculateMean(user) {
  const value = user.compStats.numOfAttempts
  / (user.compStats.numWins + user.compStats.numLosses);
  return (!Number.isNaN(value)) ? value : '---';
}

function loadStats() {
  return getAllUsers()
    .then((receivedUsers) => {
      const users = receivedUsers.map((user) => ({
        rank: -1,
        username: user.username,
        winPercent: calculateWinPercent(user),
        wins: user.compStats.numWins,
        mean: calculateMean(user),
      }));

      users.sort((user1, user2) => user1.mean - user2.mean);
      users.sort((user1, user2) => -1 * (user1.wins - user2.wins));

      users.forEach((user) => {
        user.rank = users.indexOf(user) + 1;
      });

      topUsers.value = users.slice(0, 10);
      myRank.value = users.filter((user) => user.username === store.user);
    })
    .catch((e) => {
      throw e;
    });
}

function onUpdateUserInfo() {
  loadStats()
    .catch((e) => {
      msgError.value = e;
      error.value = true;
    });
}

function init() {
  loading.value = true;
  loadStats()
    .then(() => {
      assignActionOnUsersChange(onUpdateUserInfo);
      loading.value = false;
    })
    .catch((e) => {
      msgError.value = e;
      error.value = true;
    });
}

onMounted(init);

</script>
