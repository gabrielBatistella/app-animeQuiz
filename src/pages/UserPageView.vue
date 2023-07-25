<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <LoadingIcon v-else-if="loading" msg="Loading User data..."/>
    <UserInfo v-else :userInfo="userInfo"/>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import ErrorIcon from 'src/components/ErrorIcon.vue';
import LoadingIcon from 'src/components/LoadingIcon.vue';
import UserInfo from 'src/components/UserInfo.vue';

const route = useRoute();
const router = useRouter();
const store = useStore();

// Control attributes:
const error = ref(false);
const loading = ref(true);
const msgError = ref('');

// User info:
const username = ref('');
const userInfo = ref(undefined);

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  userExists,
  getUserInfo,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  msgError.value = msg;
  error.value = true;
}

function onUpdateUserInfo(updatedUser) {
  if (updatedUser.username === userInfo.value.username) {
    userInfo.value = updatedUser;
  }
}

function init() {
  error.value = false;
  loading.value = true;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  username.value = route.params.username;

  userExists(username.value)
    .then((exists) => {
      if (exists) {
        getUserInfo(username.value)
          .then((receivedUserInfo) => {
            userInfo.value = receivedUserInfo;

            assignActionOnUsersChange(onUpdateUserInfo);
            loading.value = false;
          });
      } else {
        fatalError('User not found!');
      }
    })
    .catch(() => {
      fatalError('Something is wrong! :-(');
    });
}

onMounted(init);

</script>
