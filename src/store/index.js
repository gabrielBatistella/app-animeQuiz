import Vue from 'vue';
import Vuex from 'vuex';

import {
  userDB,
  animeDB,
} from 'boot/pouch';

import {
  requestAnimeInfoByRank,
} from 'src/AnimeAPI';

function checkUserModification(oldUserInfo, newUserInfo) {
  if (newUserInfo.username !== oldUserInfo.username) throw String('Username cant be modified');
}

function checkAnimeModification(oldAnimeData, newAnimeData) {
  if (newAnimeData.id !== oldAnimeData.id
      || newAnimeData.name !== oldAnimeData.name) throw String('Anime ID/name cant be modified');
}

function checkAnimeID(animeID) {
  if (animeID < 0) throw String('Invalid ID');
  if (animeID === 0) throw String('To check Anime of the Day, use proper methods');
}

function getCurrentDate() {
  const date = new Date();
  const currentDay = String(date.getDate()).padStart(2, '0');
  const currentMonth = String(date.getMonth() + 1).padStart(2, '0');
  const currentYear = date.getFullYear();
  return `${currentDay}-${currentMonth}-${currentYear}`;
}

function getRandomRank(maxRank) {
  return Math.floor(Math.random() * maxRank);
}

function waitTimeout(delay) {
  return new Promise((resolve) => {
    setTimeout(resolve, delay);
  });
}

const difficultyLevels = { easy: 200, medium: 1000, hard: 5000 };
const timeBetweenRequests = 1500; // milliseconds

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    user: {},
    difficulty: 'medium',

    requestTimeControl: Date.now(),

    userDB,
    /*  USER_INFO -> {
     *    _id (username)
     *    username : String
     *    password? : String            --> backend
     *    profilePic? : String (img)    --> backend
     *    coverPic? : String (img)      --> backend
     *    compStats : {numErros, numAcertos, mediaNumTentativas}
     *    casStats : {numErros, numAcertos, mediaNumTentativas}
     *    likes : [{animeID, animeName}]
     *    _rev
     *  }
     */

    animeDB,
    /*  ANIME_DATA -> {
     *    _id (id >= 1)
     *    id : int (sempre >= 1)
     *    name : String
     *    likes : [username]
     *    comments : [{username, comment}]
     *    _rev
     *  }
     *
     *  ANIME DO DIA -> {
     *    _id 0
     *    id : int (sempre >= 1)
     *    day : Date
     *    acertos : [username]
     *    erros : [username]
     *    _rev
     *  }
     */
  },

  getters: {

  },

  mutations: {

  },

  actions: {

    // MÉTODOS PARA REALIZAÇÃO DE TAREFAS ENVOLVENDO BASE DE DADO DE USUÁRIOS (MÉTODOS ASSÍNCRONOS)

    assignActionOnUsersChange({ state }, { action: func }) {
      state.userDB.changes({
        since: 'now',
        live: true,
        include_docs: true,
      }).on('change', (ev) => {
        const { _id, _rev, ...modifiedUser } = ev.doc;
        func(modifiedUser);
      });
    },

    userExists({ state }, { username: name }) {
      return state.userDB.get(name)
        .then(() => true, () => false);
    },

    addNewUser({ state }, { userInfo: info }) {
      return state.userDB.get(info.username)
        .then(() => {
          throw String('Username already exists');
        }, () => {
          const doc = {
            _id: info.username,
            ...info,
          };
          state.userDB.put(doc);
        });
    },

    modifyUserInfo({ state }, { username: name, userInfoModifier: func }) {
      return state.userDB.get(name)
        .then((doc) => {
          const { _id: oldID, _rev: oldREV, ...oldUserInfo } = doc;
          const modifiedUserInfo = func(oldUserInfo);
          checkUserModification(oldUserInfo, modifiedUserInfo);
          const newDoc = {
            _id: oldID,
            _rev: oldREV,
            ...modifiedUserInfo,
          };
          state.userDB.put(newDoc);
        }, () => {
          throw String('User doesnt exist');
        });
    },

    getUserInfo({ state }, { username: name }) {
      return state.userDB.get(name)
        .then((doc) => {
          const { _id, _rev, ...user } = doc;
          return user;
        }, () => null);
    },

    // MÉTODOS PARA REALIZAÇÃO DE TAREFAS ENVOLVENDO A BASE DE DADO DE ANIMES (MÉTODOS ASSÍNCRONOS)

    assignActionOnAnimesChange({ state }, { action: func }) {
      state.animeDB.changes({
        since: 'now',
        live: true,
        include_docs: true,
      }).on('change', (ev) => {
        const { _id, _rev, ...modifiedAnime } = ev.doc;
        func(modifiedAnime);
      });
    },

    animeExists({ state }, { animeID: id }) {
      checkAnimeID(id);
      return state.animeDB.get(id)
        .then(() => true, () => false);
    },

    addNewAnime({ state }, { animeData: data }) {
      checkAnimeID(data.id);
      return state.animeDB.get(data.id)
        .then(() => {
          throw String('Anime already exists');
        }, () => {
          const doc = {
            _id: data.id,
            ...data,
          };
          state.animeDB.put(doc);
        });
    },

    modifyAnimeData({ state }, { animeID: id, animeDataModifier: func }) {
      checkAnimeID(id);
      return state.animeDB.get(id)
        .then((doc) => {
          const { _id: oldID, _rev: oldREV, ...oldAnimeData } = doc;
          const modifiedAnimeData = func(oldAnimeData);
          checkAnimeModification(oldAnimeData, modifiedAnimeData);
          const newDoc = {
            _id: oldID,
            _rev: oldREV,
            ...modifiedAnimeData,
          };
          state.animeDB.put(newDoc);
        }, () => {
          throw String('Anime doesnt exist on database yet');
        });
    },

    getAnimeData({ state }, { animeID: id }) {
      checkAnimeID(id);
      return state.animeDB.get(id)
        .then((doc) => {
          const { _id, _rev, ...anime } = doc;
          return anime;
        }, () => null);
    },

    // MÉTODOS PARA REALIZAÇÃO DE TAREFAS ENVOLVENDO O ANIME DO DIA (MÉTODOS ASSÍNCRONOS)

    isAnimeOfTheDayDefined({ state }) {
      return state.animeDB.get(0)
        .then((doc) => {
          const today = getCurrentDate();
          if (doc.day === today) {
            return true;
          }
          return false;
        }, () => false);
    },

    defineAnimeOfTheDay({ dispatch, state }) {
      return state.animeDB.get(0)
        .then((doc) => {
          const today = getCurrentDate();
          if (doc.day === today) {
            throw String('Anime of the Day is already defined');
          } else {
            dispatch('chooseAnimeOfTheDay', { date: today })
              .then((animeInfo) => {
                const newDoc = {
                  _id: 0,
                  /* eslint-disable-next-line no-underscore-dangle */
                  _rev: doc._rev,
                  ...animeInfo,
                };
                state.animeDB.put(newDoc);
              }, () => {
                throw String('Error fetching Anime of the Day from API');
              });
          }
        }, () => {
          const today = getCurrentDate();
          dispatch('chooseAnimeOfTheDay', { date: today })
            .then((animeInfo) => {
              const doc = {
                _id: 0,
                ...animeInfo,
              };
              state.animeDB.put(doc);
            }, () => {
              throw String('Error fetching Anime of the Day from API');
            });
        });
    },

    chooseAnimeOfTheDay({ dispatch, state }, { date: today }) {
      const randRankAtDifficulty = getRandomRank(difficultyLevels[state.difficulty]);
      return dispatch('tryRequestToAnimeAPI', true, requestAnimeInfoByRank, randRankAtDifficulty, 'tv')
        .then((anime) => {
          if (anime == null) throw String('Error fetching Anime of the Day from API');
          const animeInfo = {
            id: anime.mal_id,
            day: today,
            winners: [],
            losers: [],
          };
          return animeInfo;
        });
    },

    getAnimeOfTheDayInfo({ state }) {
      return state.animeDB.get(0)
        .then((doc) => {
          const { _id, _rev, ...anime } = doc;
          return anime;
        }, () => null);
    },

    // MÉTODOS PARA REQUISIÇÃO PARA A API DE ANIMES (MÉTODOS ASSÍNCRONOS)

    /* eslint-disable-next-line max-len */
    tryRequestToAnimeAPI({ dispatch, state }, { persistent: persists, requestFunc: func, requestArgs: args }) {
      const timePassed = Date.now() - state.requestTimeControl;
      if (timePassed > timeBetweenRequests) {
        state.requestTimeControl = Date.now();
        return func(...args);
      }
      if (persists) {
        return waitTimeout(500)
          /* eslint-disable-next-line max-len */
          .then(() => dispatch('tryRequestToAnimeAPI', { persistent: persists, requestFunc: func, requestArgs: args }));
      }
      return new Promise((resolve) => {
        resolve(null);
      });
    },

  },

  modules: {

  },
});
