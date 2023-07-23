<template>
  <q-page>
    <ErrorIcon v-if="error" />
    <LoadingIcon v-else-if="loading" msg='Loading Anime info...' />
    <span v-else>
      <AnimeInfo v-if="isAnimeOfTheDay && alreadyPlayed"
        :anime="anime"
        :showExtras="true"
        :winners="animeOfTheDay.winners"
        :losers="animeOfTheDay.losers" />
      <AnimeInfo v-else
        :anime="anime"
        :showExtras="false" />
    </span>
    <span v-if="false">
      {{ `${likes} ${comments}` }}
    </span>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';
import { requestAnimeInfoById } from 'src/AnimeAPI';

import LoadingIcon from 'src/components/LoadingIcon';
import AnimeInfo from 'src/components/AnimeInfo';
import ErrorIcon from 'src/components/ErrorIcon';

const route = useRoute();
const router = useRouter();
const store = useStore();

// Control attributes:
const loading = ref(true);
const error = ref(false);
const isAnimeOfTheDay = ref(false);
const alreadyPlayed = ref(false);

// Anime data:
const id = ref(undefined);
const anime = ref(undefined);

// Anime Interactive Data:
const likes = ref([]);
const comments = ref([]);

// Fields Anime of the day:
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

function receivedAnimeInfo(_anime) {
  if (_anime == null) {
    throw String('Anime não encontrado!');
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
  if (id.value === _animeOfTheDay.id) {
    isAnimeOfTheDay.value = true;
    animeOfTheDay.value = _animeOfTheDay;

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
    receivedAnimeInteractiveData(_anime);

    if (_anime.id === animeOfTheDay.value.id) {
      receivedAnimeOfTheDay(_anime);
    }
  }
}

function fatalErro(msg) {
  error.value = true;
  console.log(`Erro: ${msg}`);
}

function init() {
  loading.value = true;
  error.value = false;
  if (user.value == null) {
    router.push('/login');
  }

  id.value = parseInt(route.params.id, 10);

  const requestAnimePromise = tryRequestToAnimeAPI(true, requestAnimeInfoById, id.value)
    .then(receivedAnimeInfo)
    .catch(() => { fatalErro('Erro ao procurar o anime!'); });

  const requestAnimeInteractiveData = getAnimeData(id.value)
    .then(receivedAnimeInteractiveData)
    .catch(() => { fatalErro('Erro ao receber dados interativos!'); });

  const requestAnimeOfTheDay = getAnimeOfTheDayInfo()
    .then(receivedAnimeOfTheDay)
    .catch(() => { fatalErro('Erro no anime do dia!'); });

  Promise.all([requestAnimePromise, requestAnimeInteractiveData, requestAnimeOfTheDay])
    .then(() => {
      assignActionOnUsersChange(() => {});
      assignActionOnAnimesChange(onUpdateAnimeInfo);
      loading.value = false;
    });
}

onMounted(init);

</script>
