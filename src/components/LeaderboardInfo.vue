<template>
  <q-card class="no-shadow no-border">
    <q-card-section>
      <div class="text-center text-h4"><q-icon name="leaderboard" size="xl"/></div>
      <div class="text-center text-h4">Leaderboard</div>
      <div class="text-center text-subtitle1">Competitive mode</div>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      <div class="text-left text-bold text-h5">Top 10:</div>
      <q-space></q-space>
      <q-table
        bordered
        class="q-mt-md"
        :rows="users"
        :columns="columns"
        @row-click="onTableClick"
        row-key="name"
        :rows-per-page-options="[0]"
        :sorted="false"
        hide-bottom
      />
    </q-card-section>
    <q-card-section>
      <div class="text-left text-bold text-h5">Your Rank:</div>
      <q-table
        bordered
        class="q-mt-md"
        :rows="myRank"
        :columns="columns"
        @row-click="onTableClick"
        row-key="name"
        hide-bottom
      />
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  users: {
    type: Array,
    required: true,
    default() {
      return [];
    },
  },
  myRank: {
    type: Array,
    required: true,
  },
});

const columns = [
  {
    name: 'rank',
    label: 'Rank',
    align: 'center',
    field: (user) => user.rank,
    format: (val) => `${val}`,
  },
  {
    name: 'username',
    required: true,
    label: 'Username',
    align: 'center',
    field: (user) => user.username,
    format: (val) => `${val}`,
  },
  {
    name: 'wins',
    required: true,
    label: 'Wins',
    align: 'center',
    field: (user) => user.wins,
    format: (val) => `${val}`,
  },
  {
    name: 'winPercent',
    required: true,
    label: 'Wins (%)',
    align: 'center',
    field: (user) => user.winPercent,
    format: (val) => `${Math.round(val * 10) / 10}`,
  },
  {
    name: 'mean',
    required: true,
    label: 'Mean Nº Attempts',
    align: 'center',
    field: (user) => user.mean,
    format: (val) => `${Math.round(val * 100) / 100}`,
  },
];

function onTableClick(evt, row) {
  router.push(`/user/${row.username}`);
}

</script>
