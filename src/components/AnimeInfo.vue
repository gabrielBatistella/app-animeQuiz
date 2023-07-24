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
                    <q-item clickable v-close-popup v-for="username, i in winners" :key="i"
                    @click="$router.push(`/user/${username}`)" >
                      <q-item-section>{{ username }}</q-item-section>
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
                    <q-item clickable v-close-popup v-for="username, i in losers" :key="i"
                    @click="$router.push(`/user/${username}`)" >
                      <q-item-section>{{ username }}</q-item-section>
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
      <div class="fit row wrap justify-center items-center content-center">
        <span class="text-h3">
          {{ title }}</span>
        <span class="row no-wrap items-center justify-center content-center">
          <template v-if="likes.includes(user)">
            <q-btn flat round icon="favorite" color="red"
              @click="dislike()">
            </q-btn>
          </template>
          <template v-else>
            <q-btn flat round icon="favorite_border" color="red"
              @click="like()">
            </q-btn>
          </template>
          <span style='opacity:0.75;' class="cursor-pointer">
            {{ `${likes.length} ${(likes.length != 1) ? 'likes' : 'like'}` }}
            <q-menu anchor="bottom left" self="top left">
              <q-item v-for="username in likes"
              clickable
              :key="username"
              @click="router.push(`/user/${username}`)">
                <q-item-section>{{ username }}</q-item-section>
              </q-item>
            </q-menu>
          </span>
        </span>
      </div>
      <div class="text-subtitle1">
        {{ `${(season !== null)
          ? (season.charAt(0).toUpperCase()
          + season.slice(1)) : '???'} - ${(year !== null) ? year : "???"}` }}
      </div>
    </q-card-section>
    <q-card-section>
      <p align="justify"><span class="text-weight-bold"> Score: </span>
        {{ score }}
      </p>
      <p align="justify"><span class="text-weight-bold"> Episodes: </span>
        {{ numberEpisodes }}
      </p>
      <p align="justify" v-if="alternativeTitles.length > 0"><span class="text-weight-bold">
        Alternative titles: </span>
        <span v-for="altTitle in alternativeTitles" :key="altTitle.name">
          {{ `${altTitle.title}${(altTitle === alternativeTitles.slice(-1)[0]) ? '' : ', '}` }}
        </span>
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
    <q-card-section v-if="trailer != null && trailer != '' && trailer != undefined">
      <div align="left" class="text-h4 q-mb-md">Trailer: </div>
      <q-video :src="trailer" ratio="1"/>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-expansion-item>
        <template v-slot:header>
          <div class="fit row wrap items-center">
            <q-icon size="sm" name="comment" class="q-mr-md"/>
            <span class="text-h6"> Comments: </span>
          </div>
          <q-space />
        </template>
        <div v-for="comment,i in comments" :key="i" class="q-mt-md q-px-lg no-wrap">
          <p align="justify"
          class="row fit no-wrap items-center justify-center content-center text-left">
            <span>
              <span class="text-weight-italic" style="opacity: 0.75;">
                {{ `${comment.username} >> ` }}
              </span>
              {{ comment.comment }}
            </span>
            <q-space style="flex:1;"/>
            <q-icon v-if="user === comment.username" @click="deleteComment(i)"
              class="text-right cursor-pointer" name="delete_outline" color="red" size="sm" />
          </p>
        </div>
        <div v-if="comments.length <= 0" class="text-center">
          <span class="text-center" style="opacity: 0.75;">
            Nothing to show, be the first!
          </span>
        </div>
        <div class="q-mt-md row fit wrap items-center justify-center content-center text-center">
          <span class="text-bold text-blue-10">
            Your comment:
          </span>
          <q-input
            ref="commentRef"
            class="q-mx-md"
            style="flex: 1;"
            v-model="myComment"
            filled square dense
            placeholder="type a comment..."
            type="text" />
          <q-btn class="right" icon="chevron_right"
            round color="blue-10" @click="sendComment" />
        </div>
      </q-expansion-item>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useStore } from 'src/stores/dbStore';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';

const router = useRouter();
const store = useStore();

const props = defineProps({
  anime: {
    type: Object,
    required: true,
  },
  likes: {
    type: Array,
    default() {
      return [];
    },
  },
  comments: {
    type: Array,
    default() {
      return [];
    },
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

const { user } = storeToRefs(store);

const myComment = ref('');
const commentRef = ref(null);

const {
  animeExists,
  addNewAnime,
  modifyUserInfo,
  modifyAnimeData,
} = store;

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

const alternativeTitles = computed(() => props.anime.titles.filter((element) => {
  if (element.title === title.value) {
    return false;
  }
  if (element.type === 'Japanese') {
    return false;
  }
  if (element.type === 'English') {
    if (element.title === title.value) {
      return false;
    }
  }
  return true;
}));

function checkIfExistsAndCreateAnime(animeId, animeName) {
  const check = animeExists(animeId)
    .then((exists) => {
      if (!exists) {
        const animeData = {
          id: animeId,
          name: animeName,
          likes: [],
          comments: [],
        };
        return addNewAnime(animeData);
      }
      return new Promise((resolve) => {
        resolve(null);
      });
    });
  return check;
}

function sendComment() {
  commentRef.value.validate();

  if (commentRef.value.hasError) {
    return;
  }

  const animeId = props.anime.mal_id;
  function changeAnimeComments(anime) {
    const newComments = [...anime.comments];
    const newComment = {
      username: user.value,
      comment: myComment.value,
    };
    newComments.push(newComment);
    const animeLikes = [...anime.likes];
    const newAnime = {
      id: anime.id,
      name: anime.name,
      likes: animeLikes,
      comments: newComments,
    };
    return newAnime;
  }
  modifyAnimeData(animeId, changeAnimeComments)
    .then(() => {
      commentRef.value.resetValidation();
      myComment.value = '';
    });
}

function deleteComment(index) {
  const animeId = props.anime.mal_id;
  function changeAnimeComments(anime) {
    const newComments = [...anime.comments];
    newComments.splice(index, 1);
    const animeLikes = [...anime.likes];
    const newAnime = {
      id: anime.id,
      name: anime.name,
      likes: animeLikes,
      comments: newComments,
    };
    return newAnime;
  }
  modifyAnimeData(animeId, changeAnimeComments);
}

function like() {
  const animeId = props.anime.mal_id;
  const animeTitle = props.anime.title;

  checkIfExistsAndCreateAnime(animeId, animeTitle)
    .then(() => {
      function changeAnimeLikes(anime) {
        const newLikes = [...anime.likes];
        newLikes.push(user.value);
        const animeComments = [...anime.comments];
        const newAnime = {
          id: anime.id,
          name: anime.name,
          likes: newLikes,
          comments: animeComments,
        };
        return newAnime;
      }
      function addLikedAnime(_user) {
        const newLikes = [...(_user.likes)];
        newLikes.push({ animeID: animeId, animeName: animeTitle });
        const newUser = {
          username: _user.username,
          password: _user.password,
          compStats: _user.compStats,
          casStats: _user.casStats,
          likes: newLikes,
        };
        return newUser;
      }

      modifyAnimeData(animeId, changeAnimeLikes);
      modifyUserInfo(user.value, addLikedAnime);
    })
    .catch(() => {
      console.log('Error has ocurred!');
    });
}

function dislike() {
  const animeId = props.anime.mal_id;
  const animeTitle = props.title;

  checkIfExistsAndCreateAnime(animeId, animeTitle)
    .then(() => {
      function changeAnimeLikes(anime) {
        const newLikes = [...(anime.likes)]
          .filter((_user) => _user !== user.value);
        const animeComments = [...(anime.comments)];
        const newAnime = {
          id: anime.id,
          name: anime.name,
          likes: newLikes,
          comments: animeComments,
        };
        return newAnime;
      }
      function removeLikedAnime(_user) {
        const newLikes = [...(_user.likes)]
          .filter((data) => data.animeID !== animeId);
        const newUser = {
          username: _user.username,
          password: _user.password,
          compStats: _user.compStats,
          casStats: _user.casStats,
          likes: newLikes,
        };
        return newUser;
      }
      modifyAnimeData(animeId, changeAnimeLikes);
      modifyUserInfo(user.value, removeLikedAnime);
    })
    .catch(() => {
      console.log('Error has ocurred!');
    });
}

</script>
