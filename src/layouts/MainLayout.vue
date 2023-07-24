<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar class="bg-blue-10 shadow-12">
        <q-toolbar-title>
          <q-img src="/logo2.png" width="150px" class="q-ml-lg q-my-sm" />
        </q-toolbar-title>
        <q-page-sticky position="top-right" :offset="[18, -24]">
          <OptionsMenu class="shadow-16"
            @clickMainMenu="router.push('/home')"
            @clickUser="router.push(`/user/${user}`)"
            @clickLeaderboards="router.push('/leaderboard')"
            @clickLeave="logout()" />
        </q-page-sticky>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <LoadingIcon v-if="loading" msg="Logging Out..." />
      <router-view v-else />
    </q-page-container>

    <q-footer elevated>
      <q-toolbar class="bg-blue-10 shadow-12">
        <q-toolbar-title class="row text-caption q-mx-lg q-my-sm">
          <div class="col-6 text-left">
            Authors: <br>
            <span v-for="author in authors"
            :key="author.name">
              <a :href="author.linkedin" target="_blank" class="text-white">
                {{ `${author.name} - ${author.nusp}` }}
              </a>
              <br>
            </span>
          </div>
          <div class="col-6 text-right q-my-lg">
            Github:
            <a href="https://github.com/gabrielBatistella/app-animeQuiz" target="_blank" class="text-white">
              github
            </a>
            <br>
            Powered by:
            <a href="https://jikan.moe/" target="_blank" class="text-white">
              Jikan API
            </a>
          </div>
        </q-toolbar-title>
      </q-toolbar>
    </q-footer>
  </q-layout>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import OptionsMenu from 'src/components/OptionsMenu';

const router = useRouter();
const store = useStore();

// Control attributes:
const loading = ref(false);
const authors = ref([
  {
    name: 'Gabriel Takeshi Miyake Batistella',
    nusp: '11232198',
    linkedin: 'https://www.linkedin.com/in/gabrielbatistella/',
  },
  {
    name: 'Thales Gomes Maurin',
    nusp: '11175712',
    linkedin: 'https://www.linkedin.com/in/thalesmaurin/',
  },
  {
    name: 'Vitor Fernando Rinaldini',
    nusp: '11232305',
    linkedin: 'https://www.linkedin.com/in/vitor-rinaldini/',
  },
]);

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  waitTimeout,
  eraseLoginFromMemory,
} = store;

function logout() {
  eraseLoginFromMemory();
  user.value = null;
  loading.value = true;
  waitTimeout(2000)
    .then(() => {
      router.push('/login');
    });
}

function init() {
  loading.value = false;
}

onMounted(init);

</script>
