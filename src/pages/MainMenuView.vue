<template>
  <q-page>
    <LoadingIcon v-if="loading" msg="Loading Main Menu..." />
    <span v-else>
      <div class="fit row wrap justify-center items-center content-center">
        <q-responsive :ratio="2100/1313" class="col" style="max-width: 620px">
          <div>
            <GameMode v-for="gameMode in gameModes"
              :key="gameMode.title"
              :title="gameMode.title"
              :background="gameMode.background"
              :description="gameMode.description"
              class="q-ma-md"
              @enterGame="router.push(`${gameMode.path}`)" />
          </div>
        </q-responsive>
      </div>
    </span>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import LoadingIcon from 'src/components/LoadingIcon';
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
  background: '/competitive.png',
  path: '/play/competitive',
});
const casualMode = ref({
  title: 'Casual Mode',
  description: 'Play as much as you want!\n'
              + 'Here you can test your skills on the game and train to crush your rivals!\n'
              + 'Your scores won\'t be uploaded to the leaderboard, but you can still see them '
              + 'and compete with your friends.',
  background: '/casual.png',
  path: '/play/casual',
});
const competitiveClosed = ref({
  title: 'Today\'s Anime',
  description: 'You have already played the competitive game of the day.\n'
              + 'If you are curious about how other players are doing in today\'s challenge, '
              + 'you can spy on their outcomes through the page of the Anime.',
  background: '/closed.png',
  path: '/anime/', // ID added on init
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
  getAnimeOfTheDayInfo,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function init() {
  loading.value = true;
  alreadyPlayed.value = false;

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
        competitiveClosed.value.path += animeOfTheDay.id.toString();
      } else {
        alreadyPlayed.value = false;
      }
      loading.value = false;
    });
}

onMounted(init);

</script>
