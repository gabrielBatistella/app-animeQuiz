<template>
  <q-card class="q-ma-md" width="auto" height="auto">
    <div class="row fit">
      <div class="col fit">
        <div class="fit row ">
          <div v-if="attemptTitleFormatted.wrong === 0" class="fit bg-green-4">
            <div
            class="fit row wrap justify-center items-center text-center text-green-10 text-bold">
              {{ attemptTitleFormatted.content }}
            </div>
          </div>
          <div v-else class="fit bg-red-4">
            <div
            class="fit row wrap justify-center items-center text-center text-red-10 text-bold">
              {{ attemptTitleFormatted.content }}
            </div>
          </div>
        </div>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <div v-if="attemptSeasonFormatted.wrong === 0" class="fit bg-green-4">
          <div>
            <q-icon name="check" color="green-10" size="md" />
          </div>
          <span class="no-wrap text-green-10 text-bold">
            <div class="row">
              {{ attemptSeasonFormatted.content.season }}
            </div>
            <div class="row">
              {{ attemptSeasonFormatted.content.year }}
            </div>
          </span>
        </div>
        <div v-else-if="attemptSeasonFormatted.wrong < 0" class="fit bg-red-4">
          <div>
            <q-icon name="keyboard_arrow_up" color="red-10" size="md" />
          </div>
          <span class="no-wrap text-red-10 text-bold">
            <div>
              {{ attemptSeasonFormatted.content.season }}
            </div>
            <div>
              {{ attemptSeasonFormatted.content.year }}
            </div>
          </span>
        </div>
        <div v-else class="fit bg-red-4">
          <div>
            <q-icon name="keyboard_arrow_down" color="red-10" size="md" />
          </div>
          <span class="no-wrap text-red-10 text-bold">
            <div>
              {{ attemptSeasonFormatted.content.season }}
            </div>
            <div>
              {{ attemptSeasonFormatted.content.year }}
            </div>
          </span>
        </div>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <div v-if="attemptNumEpisodesFormatted.wrong === 0" class="fit bg-green-4">
          <div>
            <q-icon name="check" color="green-10" size="md" />
          </div>
          <div>
            <span class="no-wrap text-green-10 text-bold">
              {{ attemptNumEpisodesFormatted.content }}
            </span>
          </div>
        </div>
        <div v-else-if="attemptNumEpisodesFormatted.wrong < 0" class="fit bg-red-4">
          <div>
            <q-icon name="keyboard_arrow_up" color="red-10" size="md" />
          </div>
          <div class="no-wrap text-red-10 text-bold">
            {{ attemptNumEpisodesFormatted.content }}
          </div>
        </div>
        <div v-else class="fit bg-red-4">
          <div>
            <q-icon name="keyboard_arrow_down" color="red-10" size="md" />
          </div>
          <div class="no-wrap text-red-10 text-bold">
            {{ attemptNumEpisodesFormatted.content }}
          </div>
        </div>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <div v-if="attemptScoreFormatted.wrong === 0" class="fit bg-green-4">
          <div>
            <q-icon name="check" color="green-10" size="md" />
          </div>
          <span class="no-wrap text-green-10 text-bold">
            {{ attemptScoreFormatted.content }}
          </span>
        </div>
        <div v-else-if="attemptScoreFormatted.wrong < 0" class="fit bg-red-4">
          <div>
            <q-icon name="keyboard_arrow_up" color="red-10" size="md" />
          </div>
          <div class="no-wrap text-red-10 text-bold">
            {{ attemptScoreFormatted.content }}
          </div>
        </div>
        <div v-else class="fit bg-red-4">
          <div>
            <q-icon name="keyboard_arrow_down" color="red-10" size="md" />
          </div>
          <div class="no-wrap text-red-10 text-bold">
            {{ attemptScoreFormatted.content }}
          </div>
        </div>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <q-btn class="fit no-border"
          :color="`${attemptGenresFormatted.proximityColor}-4`"
          label="Genres"
          :text-color="`${attemptGenresFormatted.proximityColor}-10`">
          <q-menu fit anchor="top left" self="bottom left">
            <span v-for="genre in attemptGenresFormatted.content" :key="genre.content">
              <span v-if="genre.wrong === 0">
                <q-item class="bg-green-4">
                  <q-item-section class="text-green-10">
                    {{ genre.content }}
                  </q-item-section>
                </q-item>
              </span>
              <span v-else>
                <q-item class="bg-red-4">
                  <q-item-section class="text-red-10">
                    {{ genre.content }}
                  </q-item-section>
                </q-item>
              </span>
            </span>
          </q-menu>
        </q-btn>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <q-btn class="fit no-border"
          :color="`${attemptStudiosFormatted.proximityColor}-4`"
          label="Studios"
          :text-color="`${attemptStudiosFormatted.proximityColor}-10`">
          <q-menu fit anchor="top left" self="bottom left">
            <span v-for="studio in attemptStudiosFormatted.content" :key="studio.content">
              <span v-if="studio.wrong === 0">
                <q-item class="bg-green-4">
                  <q-item-section class="text-green-10">
                    {{ studio.content }}
                  </q-item-section>
                </q-item>
              </span>
              <span v-else>
                <q-item class="bg-red-4">
                  <q-item-section class="text-red-10">
                    {{ studio.content }}
                  </q-item-section>
                </q-item>
              </span>
            </span>
          </q-menu>
        </q-btn>
      </div>
    </div>

  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  animeCorrect: {
    type: String,
    required: true,
  },
  animeAttempt: {
    type: String,
    required: true,
  },
});

function seasonToInt(season1) {
  switch (season1.toLowerCase()) {
    case 'winter':
      return 1;
    case 'spring':
      return 2;
    case 'summer':
      return 3;
    case 'fall':
      return 4;
    default:
      throw String('Invalid season');
  }
}

function compareAnimePrecedence(anime1, anime2) {
  let comparison = Math.sign(anime1.year - anime2.year);
  if (comparison === 0) {
    comparison = Math.sign(seasonToInt(anime1.season) - seasonToInt(anime2.season));
  }
  return comparison;
}

const attemptTitleFormatted = computed(() => {
  const comparison = props.animeAttempt.mal_id === props.animeCorrect.mal_id ? 0 : 1;
  const formatted = {
    wrong: comparison,
    content: props.animeAttempt.title,
  };
  return formatted;
});
const attemptSeasonFormatted = computed(() => {
  const comparison = compareAnimePrecedence(props.animeAttempt, props.animeCorrect);
  const formatted = {
    wrong: comparison,
    content: {
      season: props.animeAttempt.season.charAt(0).toUpperCase()
              + props.animeAttempt.season.slice(1),
      year: props.animeAttempt.year.toString(),
    },
  };
  return formatted;
});
const attemptNumEpisodesFormatted = computed(() => {
  const comparison = Math.sign(props.animeAttempt.episodes - props.animeCorrect.episodes);
  const formatted = {
    wrong: comparison,
    content: props.animeAttempt.episodes.toString(),
  };
  return formatted;
});
const attemptScoreFormatted = computed(() => {
  const comparison = Math.sign(props.animeAttempt.score - props.animeCorrect.score);
  const formatted = {
    wrong: comparison,
    content: props.animeAttempt.score.toString(),
  };
  return formatted;
});
const attemptGenresFormatted = computed(() => {
  let color = 'red';
  if (props.animeAttempt.genres.length === props.animeCorrect.genres.length) {
    let stillPossible = true;
    props.animeAttempt.genres.forEach((attemptGenre) => {
      if (stillPossible) {
        /* eslint-disable-next-line */
        if (!props.animeCorrect.genres.some((correctGenre) => correctGenre.mal_id === attemptGenre.mal_id)) {
          stillPossible = false;
        }
      }
    });
    if (stillPossible === true) {
      color = 'green';
    }
  }
  const formatted = {
    proximityColor: color,
    content: [],
  };
  props.animeAttempt.genres.forEach((attemptGenre) => {
    let comparison = 1;
    /* eslint-disable-next-line */
    if (props.animeCorrect.genres.some((correctGenre) => correctGenre.mal_id === attemptGenre.mal_id)) {
      comparison = 0;
      if (formatted.proximityColor === 'red') {
        formatted.proximityColor = 'yellow';
      }
    }
    formatted.content.push({
      wrong: comparison,
      content: attemptGenre.name,
    });
  });
  return formatted;
});
const attemptStudiosFormatted = computed(() => {
  let color = 'red';
  if (props.animeAttempt.studios.length === props.animeCorrect.studios.length) {
    let stillPossible = true;
    props.animeAttempt.studios.forEach((attemptStudio) => {
      if (stillPossible) {
        /* eslint-disable-next-line */
        if (!props.animeCorrect.studios.some((correctStudio) => correctStudio.mal_id === attemptStudio.mal_id)) {
          stillPossible = false;
        }
      }
    });
    if (stillPossible === true) {
      color = 'green';
    }
  }
  const formatted = {
    proximityColor: color,
    content: [],
  };
  props.animeAttempt.studios.forEach((attemptStudio) => {
    let comparison = 1;
    /* eslint-disable-next-line */
    if (props.animeCorrect.studios.some((correctStudio) => correctStudio.mal_id === attemptStudio.mal_id)) {
      comparison = 0;
      if (formatted.proximityColor === 'red') {
        formatted.proximityColor = 'yellow';
      }
    }
    formatted.content.push({
      wrong: comparison,
      content: attemptStudio.name,
    });
  });
  return formatted;
});

</script>
