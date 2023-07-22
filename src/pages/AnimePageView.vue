<template>
  <q-page>
    <LoadingIcon v-if="true" msg="Carregando anime..." />
    <Error v-else-if="error" />
    <span v-else>
      <AnimeInfo v-if="isAnimeOfTheDay"
        :anime="anime"
        :animeOfTheDay="isAnimeOfTheDay"
        :winners="animeOfTheDay.winners"
        :losers="animeOfTheDay.losers" />
      <AnimeInfo v-else
        :anime="anime"
        :animeOfTheDay="isAnimeOfTheDay" />
    </span>
    <span v-if="false">
      {{ `${likes} ${comments}` }}
    </span>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from 'src/store/dbStore';
import { requestAnimeInfoById } from 'src/AnimeAPI';

import { LoadingIcon } from 'src/components/LoadingIcon';
import { AnimeInfo } from 'src/components/AnimeInfo';
import { Error } from 'src/components/Error';

const store = useStore();

// Control attributes:
const loading = ref(true);
const isAnimeOfTheDay = ref(false);
const error = ref(false);

// Anime data:
const id = ref(undefined);
const anime = ref(undefined);

// Anime Interactive Data:
const likes = ref([]);
const comments = ref([]);

// Fields Anime of the day:
const animeOfTheDay = ref(undefined);

const {
  tryRequestToAnimeAPI,
  getAnimeOfTheDayInfo,
  getAnimeData,
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
  if (id.value === _animeOfTheDay.mal_id) {
    isAnimeOfTheDay.value = true;
    animeOfTheDay.value = _animeOfTheDay;
  } else {
    isAnimeOfTheDay.value = false;
  }
}
function onUpdateAnimeInfo(_anime) {
  if (_anime.id === 0) {
    receivedAnimeOfTheDay(_anime);
  } if (_anime.id === id.value) {
    receivedAnimeInteractiveData(_anime);
  }
}

function fatalErro(msg) {
  error.value = true;
  console.log(`Erro: ${msg}`);
}

function init() {
  loading.value = true;
  id.value = this.$route.params.id;

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
      assignActionOnAnimesChange(onUpdateAnimeInfo);
      loading.value = false;
    });
}

onMounted(init);

</script>
