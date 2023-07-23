import PouchDB from 'pouchdb';

const userDB = new PouchDB('users');
const remoteUserDB = 'http://belieber:123@10.12.20.101:5984/animequiz-users';

const animeDB = new PouchDB('animes');
const remoteAnimeDB = 'http://belieber:123@10.12.20.101:5984/animequiz-animes';

userDB.sync(remoteUserDB, { live: true });
animeDB.sync(remoteAnimeDB, { live: true });

export {
  userDB,
  animeDB,
};
