import { store } from 'quasar/wrappers';
import { createStore } from 'vuex';

const PouchDB = require('pouchdb')

// const PouchDB = require('pouchdb');

// import example from './module-example'

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default store((/* { ssrContext } */) => {
  const Store = createStore({
    state: {
      db: [],
    },

    modules: {
      // example
    },

    actions: {
      createdb({ state }) {
        state.db = new PouchDB('my_database');
      },
    },

    // enable strict mode (adds overhead!)
    // for dev mode and --debug builds only
    strict: process.env.DEBUGGING,
  });

  return Store;
});
