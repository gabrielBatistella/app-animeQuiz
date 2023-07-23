<template>
  <q-page class="bg-blue-10 fit">
      <LoadingIcon v-if="loading" :msg="msgLoading" color="white" textColor="white"/>
      <LoginBox v-else :msgError="msgError"
      @loginEvent="login" @registerEvent="register"
      @setNewError="(newError) => msgError = newError"/>
  </q-page>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import LoadingIcon from 'src/components/LoadingIcon.vue';
import LoginBox from 'src/components/LoginBox.vue';

const router = useRouter();
const store = useStore();
const { user } = storeToRefs(store);
const {
  userExists,
  addNewUser,
  getUserInfo,
  setLoginOnMemory,
  waitTimeout,
} = store;

const loading = ref(true);

const msgLoading = ref('Loading Anime Quiz...');
const msgError = ref('');

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
          compStats: { numWrongs: 0, numRights: 0, meanAttemptsNumber: 0 },
          casStats: { numWrongs: 0, numRights: 0, meanAttemptsNumber: 0 },
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

  loading.value = false;
}

onMounted(init);

</script>
