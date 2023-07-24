<template>
  <q-card class="q-ma-md" width="auto" height="auto">
    <div class="row fit">
      <div class="col fit">
        <div class="fit row wrap justify-center items-center content-center text-center">
          {{ attemptTitleFormatted }}
        </div>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <span v-if="attemptSeasonFormatted.wrong === 0" class="bg-green">
          <div>
            <q-icon name="check" color="green" size="md" />
          </div>
          <span color="green" class="no-wrap">
            <div class="row">
              {{ attemptSeasonFormatted.content.season }}
            </div>
            <div class="row">
              {{ attemptSeasonFormatted.content.year }}
            </div>
          </span>
        </span>
        <span v-else-if="attemptSeasonFormatted.wrong < 0" class="bg-red">
          <div>
            <q-icon name="keyboard_arrow_up" color="red" size="md" />
          </div>
          <span color="red" class="no-wrap">
            <div>
              {{ attemptSeasonFormatted.content.season }}
            </div>
            <div>
              {{ attemptSeasonFormatted.content.year }}
            </div>
          </span>
        </span>
        <span v-else class="bg-green">
          <div>
            <q-icon name="keyboard_arrow_down" color="red" size="md" />
          </div>
          <span color="green" class="no-wrap">
            <div>
              {{ attemptSeasonFormatted.content.season }}
            </div>
            <div>
              {{ attemptSeasonFormatted.content.year }}
            </div>
          </span>
        </span>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <span v-if="attemptNumEpisodesFormatted.wrong === 0">
          <div>
            <q-icon  name="check" color="green" size="md" />
          </div>
          <div>
            <span color="green">
            {{ attemptNumEpisodesFormatted.content }}
            </span>
          </div>
        </span>
        <span v-else-if="attemptNumEpisodesFormatted.wrong < 0">
          <div>
            <q-icon name="keyboard_arrow_up" color="red" size="md" />
          </div>
          <div color="red">
            {{ attemptNumEpisodesFormatted.content }}
          </div>
        </span>
        <span v-else>
          <div>
            <q-icon name="keyboard_arrow_down" color="red" size="md" />
          </div>
          <div color="red">
            {{ attemptNumEpisodesFormatted.content }}
          </div>
        </span>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <span v-if="attemptScoreFormatted.wrong === 0">
          <div>
            <q-icon name="check" color="green" size="md" />
          </div>
          <span color="green">
            {{ attemptScoreFormatted.content }}
          </span>
        </span>
        <span v-else-if="attemptScoreFormatted.wrong < 0">
          <div>
            <q-icon name="keyboard_arrow_up" color="red" size="md" />
          </div>
          <div color="red">
            {{ attemptScoreFormatted.content }}
          </div>
        </span>
        <span v-else>
          <div>
            <q-icon name="keyboard_arrow_down" color="red" size="md" />
          </div>
          <div color="red">
            {{ attemptScoreFormatted.content }}
          </div>
        </span>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <q-btn color="transparent" label="Genres" class="fit" text-color="black">
          <q-menu fit anchor="top left" self="bottom left">
            <span v-for="genre in attemptGenresFormatted" :key="genre.content">
              <span v-if="genre.wrong === 0">
                <q-item class="bg-green">
                  <q-item-section>
                    {{ genre.content }}
                  </q-item-section>
                </q-item>
              </span>
              <span v-else>
                <q-item class="bg-red">
                  <q-item-section>
                    {{ genre.content }}
                  </q-item-section>
                </q-item>
              </span>
            </span>
          </q-menu>
        </q-btn>
      </div>

      <div class="col justify-center items-center content-center text-center">
        <q-btn class="fit no-border" color="transparent" label="Studios" text-color="black">
          <q-menu fit anchor="top left" self="bottom left">
            <span v-for="studio in attemptStudiosFormatted" :key="studio.content">
              <span v-if="studio.wrong === 0">
                <q-item class="bg-green">
                  <q-item-section>
                    {{ studio.content }}
                  </q-item-section>
                </q-item>
              </span>
              <span v-else>
                <q-item class="bg-red">
                  <q-item-section>
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

const attemptTitleFormatted = computed(() => props.animeAttempt.title);
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
  const formatted = [];
  props.animeAttempt.genres.forEach((attemptGenre) => {
    let comparison = 1;
    /* eslint-disable-next-line */
    if (props.animeCorrect.genres.some((correctGenre) => correctGenre.mal_id === attemptGenre.mal_id)) {
      comparison = 0;
    }
    formatted.push({
      wrong: comparison,
      content: attemptGenre.name,
    });
  });
  return formatted;
});
const attemptStudiosFormatted = computed(() => {
  const formatted = [];
  props.animeAttempt.studios.forEach((attemptStudio) => {
    let comparison = 1;
    /* eslint-disable-next-line */
    if (props.animeCorrect.studios.some((correctStudio) => correctStudio.mal_id === attemptStudio.mal_id)) {
      comparison = 0;
    }
    formatted.push({
      wrong: comparison,
      content: attemptStudio.name,
    });
  });
  return formatted;
});

</script>
