import { defineStore } from 'pinia';

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

export const useStore = defineStore('dbStore', {
  state: () => ({
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
  }),

  actions: {

    // MÉTODOS PARA REALIZAÇÃO DE TAREFAS ENVOLVENDO BASE DE DADO DE USUÁRIOS (MÉTODOS ASSÍNCRONOS)

    assignActionOnUsersChange(action) {
      this.userDB.changes({
        since: 'now',
        live: true,
        include_docs: true,
      }).on('change', (ev) => {
        const { _id, _rev, ...modifiedUser } = ev.doc;
        action(modifiedUser);
      });
    },

    userExists(username) {
      return this.userDB.get(username)
        .then(() => true, () => false);
    },

    addNewUser(userInfo) {
      return this.userDB.get(userInfo.username)
        .then(() => {
          throw String('Username already exists');
        }, () => {
          const doc = {
            _id: userInfo.username,
            ...userInfo,
          };
          this.userDB.put(doc);
        });
    },

    modifyUserInfo(username, userInfoModifier) {
      return this.userDB.get(username)
        .then((doc) => {
          const { _id: oldID, _rev: oldREV, ...oldUserInfo } = doc;
          const modifiedUserInfo = userInfoModifier(oldUserInfo);
          checkUserModification(oldUserInfo, modifiedUserInfo);
          const newDoc = {
            _id: oldID,
            _rev: oldREV,
            ...modifiedUserInfo,
          };
          this.userDB.put(newDoc);
        }, () => {
          throw String('User doesnt exist');
        });
    },

    getUserInfo(username) {
      return this.userDB.get(username)
        .then((doc) => {
          const { _id, _rev, ...user } = doc;
          return user;
        }, () => null);
    },

    // MÉTODOS PARA REALIZAÇÃO DE TAREFAS ENVOLVENDO A BASE DE DADO DE ANIMES (MÉTODOS ASSÍNCRONOS)

    assignActionOnAnimesChange(action) {
      this.animeDB.changes({
        since: 'now',
        live: true,
        include_docs: true,
      }).on('change', (ev) => {
        const { _id, _rev, ...modifiedAnime } = ev.doc;
        action(modifiedAnime);
      });
    },

    animeExists(animeID) {
      checkAnimeID(animeID);
      return this.animeDB.get(animeID)
        .then(() => true, () => false);
    },

    addNewAnime(animeData) {
      checkAnimeID(animeData.id);
      return this.animeDB.get(animeData.id)
        .then(() => {
          throw String('Anime already exists');
        }, () => {
          const doc = {
            _id: animeData.id,
            ...animeData,
          };
          this.animeDB.put(doc);
        });
    },

    modifyAnimeData(animeID, animeDataModifier) {
      checkAnimeID(animeID);
      return this.animeDB.get(animeID)
        .then((doc) => {
          const { _id: oldID, _rev: oldREV, ...oldAnimeData } = doc;
          const modifiedAnimeData = animeDataModifier(oldAnimeData);
          checkAnimeModification(oldAnimeData, modifiedAnimeData);
          const newDoc = {
            _id: oldID,
            _rev: oldREV,
            ...modifiedAnimeData,
          };
          this.animeDB.put(newDoc);
        }, () => {
          throw String('Anime doesnt exist on database yet');
        });
    },

    getAnimeData(animeID) {
      checkAnimeID(animeID);
      return this.animeDB.get(animeID)
        .then((doc) => {
          const { _id, _rev, ...anime } = doc;
          return anime;
        }, () => null);
    },

    // MÉTODOS PARA REALIZAÇÃO DE TAREFAS ENVOLVENDO O ANIME DO DIA (MÉTODOS ASSÍNCRONOS)

    isAnimeOfTheDayDefined() {
      return this.animeDB.get(0)
        .then((doc) => {
          const today = getCurrentDate();
          if (doc.day === today) {
            return true;
          }
          return false;
        }, () => false);
    },

    defineAnimeOfTheDay() {
      return this.animeDB.get(0)
        .then((doc) => {
          const today = getCurrentDate();
          if (doc.day === today) {
            throw String('Anime of the Day is already defined');
          } else {
            this.chooseAnimeOfTheDay(today)
              .then((animeInfo) => {
                const newDoc = {
                  _id: 0,
                  /* eslint-disable-next-line no-underscore-dangle */
                  _rev: doc._rev,
                  ...animeInfo,
                };
                this.animeDB.put(newDoc);
              }, () => {
                throw String('Error fetching Anime of the Day from API');
              });
          }
        }, () => {
          const today = getCurrentDate();
          this.chooseAnimeOfTheDay(today)
            .then((animeInfo) => {
              const doc = {
                _id: 0,
                ...animeInfo,
              };
              this.animeDB.put(doc);
            }, () => {
              throw String('Error fetching Anime of the Day from API');
            });
        });
    },

    chooseAnimeOfTheDay(date) {
      const randRankAtDifficulty = getRandomRank(difficultyLevels[this.difficulty]);
      return this.tryRequestToAnimeAPI(true, requestAnimeInfoByRank, randRankAtDifficulty, 'tv')
        .then((anime) => {
          if (anime == null) throw String('Error fetching Anime of the Day from API');
          const animeInfo = {
            id: anime.mal_id,
            day: date,
            winners: [],
            losers: [],
          };
          return animeInfo;
        });
    },

    getAnimeOfTheDayInfo() {
      return this.animeDB.get(0)
        .then((doc) => {
          const { _id, _rev, ...anime } = doc;
          return anime;
        }, () => null);
    },

    // MÉTODOS PARA REQUISIÇÃO PARA A API DE ANIMES (MÉTODOS ASSÍNCRONOS)

    tryRequestToAnimeAPI(persistent, requestFunc, ...requestArgs) {
      const timePassed = Date.now() - this.requestTimeControl;
      if (timePassed > timeBetweenRequests) {
        this.requestTimeControl = Date.now();
        return requestFunc(...requestArgs);
      }
      if (persistent) {
        return waitTimeout(500)
          .then(() => (this.tryRequestToAnimeAPI(persistent, requestFunc, ...requestArgs)));
      }
      return new Promise((resolve) => {
        resolve(null);
      });
    },

  },
});
