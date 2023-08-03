<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <LoadingIcon v-else-if="loading" msg="Loading Leaderboard..." />
    <LeaderboardInfo v-else :users="topUsers" :myRank="myRank" />
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import ErrorIcon from 'src/components/ErrorIcon.vue';
import LoadingIcon from 'src/components/LoadingIcon.vue';
import LeaderboardInfo from 'src/components/LeaderboardInfo';

const router = useRouter();
const store = useStore();

// Control attributes:
const error = ref(false);
const loading = ref(true);
const msgError = ref('');

// Ranking info:
const topUsers = ref([]);
const myRank = ref([]);

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  getAllUsers,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  msgError.value = msg;
  error.value = true;
}

function calculateWinPercent(_user) {
  const value = _user.compStats.numWins
                / (_user.compStats.numWins + _user.compStats.numLosses);
  return (!Number.isNaN(value)) ? value * 100 : '---';
}

function calculateMean(_user) {
  const value = _user.compStats.numOfAttempts
                / (_user.compStats.numWins + _user.compStats.numLosses);
  return (!Number.isNaN(value)) ? value : '---';
}

function loadStats() {
  return getAllUsers()
    .then((receivedUsers) => {
      const users = receivedUsers.map((_user) => ({
        rank: -1,
        username: _user.username,
        winPercent: calculateWinPercent(_user),
        wins: _user.compStats.numWins,
        mean: calculateMean(_user),
      }));

      users.sort((user1, user2) => user1.mean - user2.mean);
      users.sort((user1, user2) => -1 * (user1.wins - user2.wins));

      users.forEach((_user) => {
        _user.rank = users.indexOf(_user) + 1;
      });

      topUsers.value = users.slice(0, 10);
      myRank.value = users.filter((_user) => _user.username === user.value);
    })
    .catch((e) => {
      throw e;
    });
}

function onUpdateUserInfo() {
  loadStats()
    .catch((e) => {
      fatalError(e);
    });
}

function init() {
  error.value = false;
  loading.value = true;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  loadStats()
    .then(() => {
      assignActionOnUsersChange(onUpdateUserInfo);
      loading.value = false;
    })
    .catch((e) => {
      fatalError(e);
    });
}

onMounted(init);

</script>
