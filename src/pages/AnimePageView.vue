<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <LoadingIcon v-else-if="loading" msg="Loading Anime info..." />
    <span v-else>
      <AnimeInfo v-if="isAnimeOfTheDay && alreadyPlayed"
        :anime="anime"
        :likes="likes"
        :comments="comments"
        :showExtras='true'
        :winners="animeOfTheDay.winners"
        :losers="animeOfTheDay.losers" />
      <AnimeInfo v-else
        :anime="anime"
        :likes="likes"
        :comments="comments"
        :showExtras="false" />
    </span>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';
import { requestAnimeInfoById } from 'src/AnimeAPI';

import ErrorIcon from 'src/components/ErrorIcon';
import LoadingIcon from 'src/components/LoadingIcon';
import AnimeInfo from 'src/components/AnimeInfo';

const route = useRoute();
const router = useRouter();
const store = useStore();

// Control attributes:
const error = ref(false);
const loading = ref(true);
const isAnimeOfTheDay = ref(false);
const alreadyPlayed = ref(false);
const msgError = ref('');

// Anime info:
const id = ref(undefined);
const anime = ref(undefined);

// Anime Interactive Data:
const likes = ref([]);
const comments = ref([]);

// Anime of the day:
const animeOfTheDay = ref(undefined);

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  tryRequestToAnimeAPI,
  getAnimeOfTheDayInfo,
  getAnimeData,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  msgError.value = msg;
  error.value = true;
}

function receivedAnimeInfo(_anime) {
  if (_anime == null) {
    throw String('Anime not found!');
  }
  anime.value = _anime;
}

function receivedAnimeInteractiveData(_anime) {
  if (_anime == null) {
    likes.value = [];
    comments.value = [];
  } else {
    likes.value = _anime.likes;
    comments.value = _anime.comments;
  }
}

function receivedAnimeOfTheDay(_animeOfTheDay) {
  animeOfTheDay.value = _animeOfTheDay;

  if (id.value === _animeOfTheDay.id) {
    isAnimeOfTheDay.value = true;
    const allPlayersToday = _animeOfTheDay.winners.concat(_animeOfTheDay.losers);
    if (allPlayersToday.includes(user.value)) {
      alreadyPlayed.value = true;
    } else {
      alreadyPlayed.value = false;
    }
  } else {
    isAnimeOfTheDay.value = false;
  }
}

function onUpdateAnimeInfo(_anime) {
  if (_anime.id === id.value) {
    /* eslint-disable-next-line */
    if (_anime.hasOwnProperty('day')) {
      receivedAnimeOfTheDay(_anime);
    } else {
      receivedAnimeInteractiveData(_anime);
    }
  }
}

function init() {
  error.value = false;
  loading.value = true;
  isAnimeOfTheDay.value = false;
  alreadyPlayed.value = false;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  id.value = parseInt(route.params.id, 10);

  const requestAnimePromise = tryRequestToAnimeAPI(true, requestAnimeInfoById, id.value)
    .then(receivedAnimeInfo)
    .catch(() => { throw String('Anime not found!'); });

  const requestAnimeInteractiveData = getAnimeData(id.value)
    .then(receivedAnimeInteractiveData)
    .catch(() => { throw String('Something is wrong! :-('); });

  const requestAnimeOfTheDay = getAnimeOfTheDayInfo()
    .then(receivedAnimeOfTheDay)
    .catch(() => { throw String('Something is wrong! :-('); });

  Promise.all([requestAnimePromise, requestAnimeInteractiveData, requestAnimeOfTheDay])
    .then(() => {
      assignActionOnAnimesChange(onUpdateAnimeInfo);
      loading.value = false;
    })
    .catch((e) => {
      fatalError(e);
    });
}

onMounted(init);

</script>
