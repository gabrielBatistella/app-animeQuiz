<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <LoadingIcon v-else-if="loading" msg="Loading Game..." />
    <span v-else>
      <AlreadyPlayedIcon v-if="alreadyPlayed" />
      <span v-else>
        <q-img src="logo" class="absolute-top" />
        <div class="row fit justify-center items-center content-center q-my-xl">
          <AnswerTextField class="q-my-xl" @attempt="checkAttempt" />
        </div>
        <q-list dense class="q-pt-none">
          <q-item v-for="attempt in attempts" :key="attempt.index">
            <q-item-section>
              <AnswerAttempt :animeCorrect="answerAnime" :animeAttempt="attempt.anime" />
            </q-item-section>
          </q-item>
        </q-list>
      </span>
      <WinPopup v-if="won" :numOfAttempts="attempts.length + 1" />
      <LossPopup v-else-if="lost" />
      <CompetitiveClosedPopup v-else-if="dayIsOver" />
    </span>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';
import { requestAnimeInfoById } from 'src/AnimeAPI';

import ErrorIcon from 'src/components/ErrorIcon';
import LoadingIcon from 'src/components/LoadingIcon';
import AlreadyPlayedIcon from 'src/components/AlreadyPlayedIcon';
import WinPopup from 'src/components/WinPopup';
import LossPopup from 'src/components/LossPopup';
import CompetitiveClosedPopup from 'src/components/CompetitiveClosedPopup';
import AnswerTextField from 'src/components/AnswerTextField';
import AnswerAttempt from 'src/components/AnswerAttempt';

const router = useRouter();
const store = useStore();

// Control attributes:
const error = ref(false);
const loading = ref(true);
const alreadyPlayed = ref(false);
const won = ref(false);
const lost = ref(false);
const dayIsOver = ref(false);
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
  tryRequestToAnimeAPI,
  modifyUserInfo,
  isAnimeOfTheDayDefined,
  getAnimeOfTheDayInfo,
  addPlayerToAnimeOfTheDayHistory,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  error.value = true;
  msgError.value = msg;
  console.log(`ERROR: ${msg}`);
}

function playerWon() {
  function addCompetitiveWin(_user) {
    const newCompStats = { ..._user.compStats };
    newCompStats.numWins += 1;
    newCompStats.numOfAttempts += attempts.value.length;
    const newUser = {
      username: _user.username,
      password: _user.password,
      compStats: newCompStats,
      casStats: _user.casStats,
      likes: _user.likes,
    };
    return newUser;
  }

  isAnimeOfTheDayDefined()
    .then((isDefined) => {
      if (!isDefined) {
        dayIsOver.value = true;
      } else {
        console.log('AAAAAAAAAAA');
        console.log(attempts.value.length);
        won.value = true;
        console.log('BBBBBBBBBBBBB');

        const defaultWait = waitTimeout(5000)
          .then(() => {});
        const updateUserStats = modifyUserInfo(user.value, addCompetitiveWin);
        const updateAnimeOfTheDayPlayers = addPlayerToAnimeOfTheDayHistory(user.value, true);

        Promise.all([defaultWait, updateUserStats, updateAnimeOfTheDayPlayers])
          .then(() => {
            router.push(`/anime/${answerAnime.value.mal_id}`);
          })
          .catch(() => {
            fatalError('Something is wrong! :-(');
          });
      }
    });
}

function playerLost() {
  function addCompetitiveLoss(_user) {
    const newCompStats = { ..._user.compStats };
    newCompStats.numLosses += 1;
    newCompStats.numOfAttempts += attempts.value.length;
    const newUser = {
      username: _user.username,
      password: _user.password,
      compStats: newCompStats,
      casStats: _user.casStats,
      likes: _user.likes,
    };
    return newUser;
  }

  isAnimeOfTheDayDefined()
    .then((isDefined) => {
      if (!isDefined) {
        dayIsOver.value = true;
      } else {
        lost.value = true;

        const defaultWait = waitTimeout(5000)
          .then(() => {});
        const updateUserStats = modifyUserInfo(user.value, addCompetitiveLoss);
        const updateAnimeOfTheDayPlayers = addPlayerToAnimeOfTheDayHistory(user.value, false);

        Promise.all([defaultWait, updateUserStats, updateAnimeOfTheDayPlayers])
          .then(() => {
            router.push(`/anime/${answerAnime.value.mal_id}`);
          })
          .catch(() => {
            fatalError('Something is wrong! :-(');
          });
      }
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

function onUpdateAnimeInfo(anime) {
  /* eslint-disable-next-line */
  if (anime.hasOwnProperty('day')) {
    if (anime.id !== answerAnime.value.mal_id) {
      dayIsOver.value = true;
    }
  }
}

function init() {
  error.value = false;
  loading.value = true;
  alreadyPlayed.value = false;
  won.value = false;
  lost.value = false;
  dayIsOver.value = false;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  getAnimeOfTheDayInfo()
    .then((animeOfTheDay) => {
      const allPlayersToday = animeOfTheDay.winners.concat(animeOfTheDay.losers);
      if (allPlayersToday.includes(user.value)) {
        alreadyPlayed.value = true;
        loading.value = false;
      } else {
        alreadyPlayed.value = false;
        tryRequestToAnimeAPI(true, requestAnimeInfoById, animeOfTheDay.id)
          .then((anime) => {
            if (anime == null) {
              fatalError('Anime for the game not found, try reloading the page');
            }
            answerAnime.value = anime;

            assignActionOnAnimesChange(onUpdateAnimeInfo);
            loading.value = false;
          });
      }
    });
}

onMounted(init);

</script>
