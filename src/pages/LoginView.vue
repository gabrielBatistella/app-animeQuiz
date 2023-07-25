<template>
  <q-page class="bg-blue-10 fullscreen">
    <LoadingIcon v-if="loading"
      :msg="msgLoading"
      textColor="white" />
    <div v-else>
      <div class="fit row justify-center items-center content-center q-mt-xl">
        <q-img src="/logo2.png" width="500px" />
      </div>
      <div class="absolute-center">
        <LoginBox
          :msgError="msgError"
          @loginEvent="login"
          @registerEvent="register"
          @setNewError="(newError) => (msgError = newError)" />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import LoadingIcon from 'src/components/LoadingIcon.vue';
import LoginBox from 'src/components/LoginBox.vue';

const router = useRouter();
const store = useStore();

// Control attributes:
const loading = ref(true);
const msgLoading = ref('Loading Anime Quiz...');
const msgError = ref('');

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  waitTimeout,
  userExists,
  addNewUser,
  getUserInfo,
  setLoginOnMemory,
  getLoginFromMemory,
  eraseLoginFromMemory,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function login(username, password) {
  msgLoading.value = 'Logging in account..';
  loading.value = true;

  const defaultWait = waitTimeout(2000)
    .then(() => {});

  const operation = getUserInfo(username)
    .then((receivedUser) => {
      if (receivedUser == null) {
        throw String('User not found!');
      } else if (receivedUser.password !== password) {
        throw String('Incorrect password!');
      } else {
        const loginData = { username, password };
        setLoginOnMemory(loginData);
        user.value = username;
      }
    });

  Promise.all([defaultWait, operation])
    .then(() => {
      router.push('/home');
    })
    .catch((e) => {
      eraseLoginFromMemory();
      msgError.value = e;
      loading.value = false;
    });
}

function register(username, password) {
  msgLoading.value = 'Registering account';
  loading.value = true;
  const defaultWait = waitTimeout(2000)
    .then(() => {});

  const operation = userExists(username)
    .then((exists) => {
      if (exists) {
        throw String('Username not available, choose another!');
      } else {
        const userData = {
          username,
          password,
          compStats: { numWins: 0, numLosses: 0, numOfAttempts: 0 },
          casStats: { numWins: 0, numLosses: 0, numOfAttempts: 0 },
          likes: [],
        };
        const loginData = {
          username,
          password,
        };

        addNewUser(userData)
          .catch(() => { throw String('Error has ocurred!'); });
        setLoginOnMemory(loginData)
          .catch(() => { throw String('Error has ocurred!'); });

        user.value = username;
      }
    });

  Promise.all([defaultWait, operation])
    .then(() => {
      router.push('/home');
    })
    .catch((error) => {
      msgError.value = error;
      loading.value = false;
    });
}

function init() {
  loading.value = true;
  msgLoading.value = 'Checking for logged account...';
  msgError.value = '';

  if (user.value != null) {
    router.push('/home');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  const defaultWait = waitTimeout(2000)
    .then(() => {});

  const operation = getLoginFromMemory();

  Promise.all([defaultWait, operation])
    .then((results) => {
      const loginData = results[1];
      if (loginData == null) {
        loading.value = false;
      } else {
        login(loginData.username, loginData.password);
      }
    })
    .catch((error) => {
      msgError.value = error;
      loading.value = false;
    });
}

onMounted(init);

</script>
