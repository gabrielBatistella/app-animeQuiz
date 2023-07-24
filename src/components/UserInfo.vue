<template>
  <q-card class="no-border no-shadow">
    <q-card-section class="row justify-center items-center content-center">
      <span class="text-h2 text-center">@ {{ userInfo.username }}</span>
    </q-card-section>
    <q-separator />
    <q-card-section class="row">
      <q-icon color="black" name="bar_chart" size="lg" />
      <span class="text-h4 text-left"> Statistics: </span>
    </q-card-section>
    <q-card-section>
      <q-table
        bordered
        class="no-shadow"
        :rows="rows"
        :columns="columns"
        row-key="name"
        separator="vertical"
        hide-bottom />
    </q-card-section>
    <q-card-section class="row">
      <q-icon color="red" name="favorite" size="lg" />
      <span class="text-h4 text-left text-red"> Liked animes: </span>
    </q-card-section>
    <q-card-section>
      <q-list v-if="likedAnimes.length > 0" bordered separator>
        <q-item
          clickable
          v-ripple
          v-for="like in likedAnimes"
          :key="like.animeID"
          @click="router.push(`/anime/${like.animeID}`)">
          <q-item-section class="text-center">
            {{ like.animeName }}
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else class="text-center">Nothing to show!</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
  },
});

const columns = [
  {
    name: 'name',
    align: 'center',
    field: (row) => row.name,
    format: (val) => `${val}`,
  },
  {
    name: 'winPercent',
    required: true,
    label: 'Win %',
    align: 'center',
    field: (row) => row.winPercent,
    format: (val) => `${val}`,
  },
  {
    name: 'wins',
    required: true,
    label: 'Wins',
    align: 'center',
    field: (row) => row.wins,
    format: (val) => `${val}`,
  },
  {
    name: 'losses',
    required: true,
    label: 'Losses',
    align: 'center',
    field: (row) => row.losses,
    format: (val) => `${val}`,
  },
  {
    name: 'attempts',
    required: true,
    label: 'Nº Attempts',
    align: 'center',
    field: (row) => row.attempts,
    format: (val) => `${val}`,
  },
];

function calculateCompetitiveWinPercent() {
  return props.userInfo.compStats.numWins
  / (props.userInfo.compStats.numLosses + props.userInfo.compStats.numWins);
}

function calculateCasualWinPercent() {
  return props.userInfo.compStats.numWins
/ (props.userInfo.compStats.numLosses + props.userInfo.compStats.numWins);
}

const competitiveWinPercent = computed(calculateCompetitiveWinPercent);
const casualWinPercent = computed(calculateCasualWinPercent);

const likedAnimes = computed(() => {
  const likes = [...(props.userInfo.likes)];
  likes.sort((like1, like2) => like1.animeName > like2.animeName);
  return likes;
});

const rows = [
  {
    name: 'Competitive',
    wins: props.userInfo.compStats.numWins,
    losses: props.userInfo.compStats.numLosses,
    attempts: props.userInfo.compStats.numOfAttempts,
    winPercent: (!Number.isNaN(competitiveWinPercent.value)) ? competitiveWinPercent.value : '---',
  },
  {
    name: 'Casual',
    wins: props.userInfo.casStats.numWins,
    losses: props.userInfo.casStats.numLosses,
    attempts: props.userInfo.casStats.numOfAttempts,
    winPercent: (!Number.isNaN(casualWinPercent.value)) ? casualWinPercent.value : '---',
  },
];

</script>
