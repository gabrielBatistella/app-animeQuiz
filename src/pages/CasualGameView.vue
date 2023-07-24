<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <LoadingIcon v-else-if="loading" msg="Loading Game..." />
    <span v-else>
      <q-img src="logo" class="absolute-top" />
      <div class="row fit justify-center items-center content-center q-my-xl">
        <AnswerTextField @attempt="checkAttempt" />
      </div>
      <q-list dense class="q-pt-none">
        <q-item v-for="attempt in attempts" :key="attempt.index">
          <q-item-section>
            <AnswerAttempt :animeCorrect="answerAnime" :animeAttempt="attempt.anime" />
          </q-item-section>
        </q-item>
      </q-list>
      <WinPopup v-if="won" :numOfAttempts="attempts.length + 1" />
      <LossPopup v-else-if="lost" />
    </span>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';
import { requestAnimeInfoByRank } from 'src/AnimeAPI';

import ErrorIcon from 'src/components/ErrorIcon';
import LoadingIcon from 'src/components/LoadingIcon';
import WinPopup from 'src/components/WinPopup';
import LossPopup from 'src/components/LossPopup';
import AnswerTextField from 'src/components/AnswerTextField';
import AnswerAttempt from 'src/components/AnswerAttempt';

const router = useRouter();
const store = useStore();

// Control attributes:
const error = ref(false);
const loading = ref(true);
const won = ref(false);
const lost = ref(false);
const msgError = ref('');

// Anime info:
const answerAnime = ref(undefined);

// Attempts data:
const attempts = ref([]);
const maxAttempts = 10;

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  waitTimeout,
  randRankAtDifficulty,
  tryRequestToAnimeAPI,
  modifyUserInfo,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  error.value = true;
  msgError.value = msg;
  console.log(`ERROR: ${msg}`);
}

function playerWon() {
  function addCasualWin(_user) {
    const newCasStats = { ..._user.casStats };
    newCasStats.numWins += 1;
    newCasStats.numOfAttempts += attempts.value.length;
    const newUser = {
      username: _user.username,
      password: _user.password,
      compStats: _user.compStats,
      casStats: newCasStats,
      likes: _user.likes,
    };
    return newUser;
  }

  won.value = true;

  const defaultWait = waitTimeout(5000)
    .then(() => {});
  const updateUserStats = modifyUserInfo(user.value, addCasualWin);

  Promise.all([defaultWait, updateUserStats])
    .then(() => {
      router.push(`/anime/${answerAnime.value.mal_id}`);
    })
    .catch(() => {
      fatalError('Something is wrong! :-(');
    });
}

function playerLost() {
  function addCasualLoss(_user) {
    const newCasStats = { ..._user.casStats };
    newCasStats.numLosses += 1;
    newCasStats.numOfAttempts += attempts.value.length;
    const newUser = {
      username: _user.username,
      password: _user.password,
      compStats: _user.compStats,
      casStats: newCasStats,
      likes: _user.likes,
    };
    return newUser;
  }

  lost.value = true;

  const defaultWait = waitTimeout(5000)
    .then(() => {});
  const updateUserStats = modifyUserInfo(user.value, addCasualLoss);

  Promise.all([defaultWait, updateUserStats])
    .then(() => {
      router.push(`/anime/${answerAnime.value.mal_id}`);
    })
    .catch(() => {
      fatalError('Something is wrong! :-(');
    });
}

function checkAttempt(_anime) {
  attempts.value.push({
    index: attempts.value.length,
    anime: _anime,
  });
  if (_anime.mal_id === answerAnime.value.mal_id) {
    playerWon();
  } else if (attempts.value.length >= maxAttempts) {
    playerLost();
  }
}

function init() {
  error.value = false;
  loading.value = true;
  won.value = false;
  lost.value = false;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  tryRequestToAnimeAPI(true, requestAnimeInfoByRank, randRankAtDifficulty, 'tv')
    .then((anime) => {
      if (anime == null) {
        fatalError('Anime for the game not found, try reloading the page');
      }
      answerAnime.value = anime;
      loading.value = false;
    });
}

onMounted(init);

</script>
