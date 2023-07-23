<template>
  <q-page>
    <LoadingIcon v-if="loading" msg='Loading Main Menu...' />
    <OptionsMenu class='absolute-top-right q-ma-lg'
      @clickUser='router.push(`/user/${user}`)'
      @clickLeaderboards='router.push("/leaderboards")'
      @clickLeave='logout()' />
    <GameMode v-for='gameMode in gameModes'
    :key='gameMode.title'
    :title='gameMode.title'
    :description='gameMode.description'
    @enterGame='router.push(`${gameMode.path}`)' />
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import LoadingIcon from 'src/components/LoadingIcon';
import OptionsMenu from 'src/components/OptionsMenu';
import GameMode from 'src/components/GameMode';

const router = useRouter();
const store = useStore();

// Control attributes:
const loading = ref(true);
const alreadyPlayed = ref(false);

// Game modes info:
const competitiveMode = ref({
  title: 'Competitive Mode',
  description: 'Limited to 1 game each day!\n'
              + 'Try to find out the secret anime\'s name in as few attempts as possible '
              + 'and see how your abilities compare against other players on the leaderboard.\n'
              + 'Aim for the #1 spot!',
  background: '',
  path: '/competitive',
});
const casualMode = ref({
  title: 'Casual Mode',
  description: 'Play as much as you want!\n'
              + 'Here you can test your skills on the game and train to crush your rivals!\n'
              + 'Your scores won\'t be uploaded to the leaderboard, but you can still see them '
              + 'and compete with your friends.',
  background: '',
  path: '/casual',
});
const competitiveClosed = ref({
  title: 'Check out today\'s Anime',
  description: 'You have already played the competitive game of the day.\n'
              + 'If you are curious about how other players are doing in today\'s challenge, '
              + 'you can spy on their outcomes through the page of the Anime.',
  background: '',
  path: '/competitive',
});
const gameModes = computed(() => {
  if (alreadyPlayed.value) {
    return [competitiveClosed.value, casualMode.value];
  }
  return [competitiveMode.value, casualMode.value];
});

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  eraseLoginFromMemory,
  getAnimeOfTheDayInfo,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function logout() {
  eraseLoginFromMemory();
  user.value = null;
  router.push('/login');
}

function init() {
  loading.value = true;
  if (user.value == null) {
    router.push('/login');
  }

  getAnimeOfTheDayInfo()
    .then((animeOfTheDay) => {
      const allPlayersToday = animeOfTheDay.winners.concat(animeOfTheDay.losers);
      if (allPlayersToday.includes(user.value)) {
        alreadyPlayed.value = true;
      } else {
        alreadyPlayed.value = false;
      }

      assignActionOnUsersChange(() => {});
      assignActionOnAnimesChange(() => {});
      loading.value = false;
    });
}

onMounted(init);

</script>
