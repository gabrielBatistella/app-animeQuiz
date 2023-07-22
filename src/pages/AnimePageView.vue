<template>
  <q-page>
    <LoadingIcon v-if="loading" msg="Carregando anime..." />
    <error v-else-if="error" />
    <AnimeInfo v-else :anime="anime" />
  </q-page>
</template>

<script setup>
import { requestAnimeInfoById } from 'src/AnimeAPI';
import { mapActions } from 'vuex';
import { ref } from 'vue';

import { LoadingIcon } from 'src/components/LoadingIcon';
import { AnimeInfo } from 'src/components/AnimeInfo';
import { Error } from 'src/components/Error';

// Control attributes:
const loading = ref(true);
const isAnimeOfTheDay = ref(false);
const error = ref(false);

// Anime data:
const id = ref(undefined);
const anime = ref(undefined)

// Anime Interactive Data:
const likes = ref([]);
const comments = ref([]);

// Fields Anime of the day:
animeOfTheDay = ref(undefined),

// ...mapActions(['getAnimeData', 'assignActionOnAnimesChange', 'addNewAnime']);

function receivedAnimeInfo(anime) {
  if (anime == null) {
    throw 'Anime não encontrado!';
  }
  anime.value = anime;
}

function receivedAnimeInteractiveData(anime) {
  if (anime == null) {
    likes = [];
    comments = [];
  } else {
    likes = anime.likes;
    comments = anime.comments;
  }
}
function receivedAnimeOfTheDay(animeOfTheDay) {
  if (id == animeOfTheDay.mal_id) {
    isAnimeOfTheDay = true;
    animeOfTheDay = animeOfTheDay;
  }
  else {
    isAnimeOfTheDay = false;
  }
}
function onUpdateAnimeInfo(anime) {
  if (anime.id == 0) {
    receivedAnimeOfTheDay(anime);
  } if (anime.id == this.id) {
    receivedAnimeInteractiveData(anime);
  }
}

function fatalErro(msg) {
  error=true;
  console.log(`Erro: ${msg}`)
}

function init() {
  loading = true;
  id = this.$route.params.id;

  const requestAnimePromise = requestAnimeInfoById(this.id)
    .then(receivedAnimeInfo)
    .catch(() => { fatalErro('Erro ao procurar o anime!') });

  const requestAnimeInteractiveData = this.getAnimeData()
    .then(receivedAnimeInteractiveData)
    .catch(() => { fatalErro('Erro ao receber dados interativos!') });

  const requestAnimeOfTheDay = this.getAnimeOfTheDay()
    .then(receivedAnimeOfTheDay)
    .catch(() => { fatalErro('Erro no anime do dia!') });

  Promise.all([requestAnimePromise, requestAnimeInteractiveData, requestAnimeOfTheDay])
    .then(() => {
      assignActionOnAnimesChange(onUpdateAnimeInfo);
      loading = false;
    });
}

onMounted(init);
</script>
