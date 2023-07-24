<template>
  <div class="row">
    <q-select
      ref="textField"
      :model-value="text"
      :options="autocomplete"
      :label="msg"
      @input-value="updateAutocomplete"
      standout="bg-grey-6 text-dark"
      stack-label
      label-color="red"
      use-input
      hide-selected
      fill-input
      behavior="menu"
      hide-dropdown-icon
      input-debounce="0"
      style="width: 60vw;">
        <template v-slot:no-option>
          <q-item>
            <q-item-section class="text-grey">
              No animes found...
            </q-item-section>
          </q-item>
        </template>
      </q-select>
    <q-btn
      @click="sendAttempt()"
      label="Send"
      color="blue-10"
      glossy />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useStore } from 'src/stores/dbStore';
import { requestAnimesWithName, requestAnimeInfoByName } from 'src/AnimeAPI';

const emit = defineEmits({
  attempt: null,
});

const store = useStore();

const text = ref('');
const textField = ref(null);
const autocomplete = ref([]);
const msg = ref('');

const {
  tryRequestToAnimeAPI,
} = store;

function updateAutocomplete(val) {
  text.value = val;
  textField.value.showPopup();
  tryRequestToAnimeAPI(false, requestAnimesWithName, val, 10, 'tv')
    .then((animes) => {
      if (animes != null) {
        autocomplete.value = animes.map((anime) => anime.title);
      }
    });
}

function checkImportantParameters(anime) {
  return !(anime.title == null
        || anime.season == null
        || anime.year == null
        || anime.episodes == null
        || anime.score == null
        || anime.genres == null
        || anime.studios == null);
}

function sendAttempt() {
  const animeAttempted = text.value;
  text.value = '';
  tryRequestToAnimeAPI(true, requestAnimeInfoByName, animeAttempted)
    .then((anime) => {
      if (anime == null) {
        msg.value = 'The anime you sent wasn\'t found on the database';
      } else if (!checkImportantParameters(anime)) {
        msg.value = 'The anime you sent is missing some information';
      } else {
        emit('attempt', anime);
        msg.value = '';
      }
    });
}

</script>
