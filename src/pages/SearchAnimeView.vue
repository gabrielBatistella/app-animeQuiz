<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError"/>
    <q-card v-else class=" no-border no-shadow">
      <q-card-section>
        <div class="text-h4 text-left ">
          Find anime:
        </div>
        <q-input
          v-model="textToSearch"
          filled
          placeholder="Search"
          hint="Type an anime name"
          @keydown.enter="updateSearch">
          <template v-slot:append>
            <q-icon name="search" @click="updateSearch"/>
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-sm">
        <div class="q-pa-lg flex flex-center">
          <q-pagination
            v-if="showPagination"
            v-model="currentPage"
            color="blue-10"
            :max="maxPages"
            :max-pages="6"
            boundary-numbers
            @update:model-value="updatePage" />
        </div>
        <q-linear-progress indeterminate v-if="loading" />
        <q-list bordered separator v-if="currentAnimeList.length > 0">
          <q-item v-for="anime in currentAnimeList"
            :key="anime.mal_id"
            @click="router.push(`/anime/${anime.mal_id}`)"
            clickable
            v-ripple>
            <q-item-section>
              <q-item-label>
                {{ anime.title }}
              </q-item-label>
              <q-item-label caption v-if="anime.season !== null && anime.year != null">
                {{ `${anime.season} - ${anime.year}` }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="text-subtitle2 text-center" style="opacity: 75%;" v-else>
          Nothing to show!
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';
import { requestAnimeSearch } from 'src/AnimeAPI';

import ErrorIcon from 'src/components/ErrorIcon.vue';

const router = useRouter();
const store = useStore();

// Control attributes:
const loading = ref(false);
const error = ref(false);
const showPagination = ref(false);
const msgError = ref('');

// Search info:
const textToSearch = ref('');

// Display animes info:
const numOfAnimesOnPage = ref(10);
const currentAnimeList = ref([]);
const currentPage = ref(1);
const maxPages = ref(1);

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  tryRequestToAnimeAPI,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  msgError.value = msg;
  error.value = true;
}

function updatePage() {
  loading.value = true;

  const valueToSearch = textToSearch.value;
  const page = currentPage.value;

  tryRequestToAnimeAPI(true, requestAnimeSearch, valueToSearch, numOfAnimesOnPage.value, page)
    .then((receivedPackege) => {
      maxPages.value = receivedPackege.numPages;
      currentAnimeList.value = receivedPackege.data;

      loading.value = false;
    })
    .catch((e) => {
      fatalError(e);
    });
}

function updateSearch() {
  showPagination.value = false;
  loading.value = true;

  const valueToSearch = textToSearch.value;

  tryRequestToAnimeAPI(true, requestAnimeSearch, valueToSearch, numOfAnimesOnPage.value, 1)
    .then((receivedPackege) => {
      maxPages.value = receivedPackege.numPages;
      currentAnimeList.value = receivedPackege.data;
      currentPage.value = 1;

      if (currentAnimeList.value > 0) {
        showPagination.value = true;
      }

      loading.value = false;
    })
    .catch((e) => {
      fatalError(e);
    });
}

function init() {
  loading.value = false;
  error.value = false;
  showPagination.value = false;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});
}

onMounted(init);

</script>
