<template>
  <q-card>
    <q-card-section>
      <div class="text-center">
        <q-img :src="imageUrl">
          <div
          class="absolute-bottom row justify-between items-start content-start items-center"
            v-if="showExtras">
            <div color="green" text-color="primary" class="row items-center">
              <q-btn class="items-center" color="green" icon="done" round>
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup v-for="user, i in winners" :key="i">
                      <q-item-section>{{ user }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
              <span class="text-green text-h6 q-ml-sm">
                {{ `${winners.length} ${(winners.length > 1) ? 'winner' : 'winners'}` }}
              </span>
            </div>

            <div color="green" text-color="primary" class="row items-center">
              <span class="text-red text-h6 q-mr-sm">
                {{ `${losers.length} ${(losers.length > 1) ? 'loser' : 'losers'}` }}
              </span>
              <q-btn class="items-center" color="red" icon="close" round>
                <q-menu>
                  <q-list style="min-width: 100px">
                    <q-item clickable v-close-popup v-for="user, i in losers" :key="i">
                      <q-item-section>{{ user }}</q-item-section>
                    </q-item>
                  </q-list>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </q-img>
      </div>
    </q-card-section>
    <q-separator/>
    <q-card-section class="text-center">
      <div class="text-h3">
        {{ title }}
      </div>
      <div class="text-subtitle1">
        {{ `${season.charAt(0).toUpperCase() + season.slice(1)} - ${year}` }}
      </div>
    </q-card-section>
    <q-card-section>
      <p align="justify"><span class="text-weight-bold"> Score: </span>
        {{ score }}
      </p>
      <p align="justify"><span class="text-weight-bold"> Episodes: </span>
        {{ numberEpisodes }}
      </p>
      <p align="justify"> <span class="text-weight-bold"> Studios: </span>
        <span v-for="studio in studios" :key="studio.mal_id">
          {{ `${studio.name}${(studio.mal_id === studios.slice(-1)[0].mal_id) ? '' : ', '}` }}
        </span>
      </p>
      <p align="justify"> <span class="text-weight-bold"> Genres: </span>
        <span v-for="genre in genres" :key="genre.mal_id">
          {{ `${genre.name}${(genre.mal_id === genres.slice(-1)[0].mal_id) ? '' : ', '}` }}
        </span>
      </p>
      <p align="justify"> <span class="text-weight-bold"> Synopsis: </span> {{ synopsis }} </p>
    </q-card-section>
    <q-separator/>
    <q-card-section>
      <div align="left" class="text-h4 q-mb-md">Trailer: </div>
      <q-video :src="trailer" ratio="1"/>
    </q-card-section>

  </q-card>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  anime: {
    type: Object,
    required: true,
  },
  showExtras: {
    type: Boolean,
    default() {
      return false;
    },
  },
  winners: {
    type: Array,
    default() {
      return [];
    },
  },
  losers: {
    type: Array,
    default() {
      return [];
    },
  },
});

const title = computed(() => props.anime.title);
const imageUrl = computed(() => props.anime.images.jpg.large_image_url);
const year = computed(() => props.anime.year);
const trailer = computed(() => props.anime.trailer.embed_url);
const season = computed(() => props.anime.season);
const numberEpisodes = computed(() => props.anime.episodes);
const synopsis = computed(() => props.anime.synopsis);
const studios = computed(() => props.anime.studios);
const genres = computed(() => props.anime.genres);
const score = computed(() => props.anime.score);

</script>
