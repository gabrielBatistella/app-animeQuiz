<template>
  <q-page>
    <ErrorIcon v-if="error" :msg="msgError" />
    <q-card v-else class=" no-border no-shadow">
      <q-card-section>
        <div class="text-h4 text-left ">
          Find username:
        </div>
        <q-input
          v-model="textToSearch"
          debounce="200"
          filled
          placeholder="Search"
          hint="Type an username"
          @update:model-value="update">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </q-card-section>
      <q-separator />
      <q-card-section class="q-pa-sm">
        <q-linear-progress v-if="loading" indeterminate />
        <q-list bordered separator v-if="foundUsers.length > 0">
          <q-item v-for="username in foundUsers"
            :key="username"
            @click="router.push(`/user/${username}`)"
            clickable
            v-ripple>
            <q-item-section>
              <q-item-label>
                {{ username }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
        <div class="text-subtitle2 text-center" style="opacity: 75%;" v-else>
          Nothing to show!
        </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'src/stores/dbStore';
import { storeToRefs } from 'pinia';

import ErrorIcon from 'src/components/ErrorIcon.vue';

const router = useRouter();
const store = useStore();

// Control attributes:
const error = ref(false);
const loading = ref(false);
const msgError = ref('');

// User search info:
const textToSearch = ref('');
const foundUsers = ref([]);

// Store attributes and methods:
const { user } = storeToRefs(store);
const {
  getAllUsers,
  assignActionOnUsersChange,
  assignActionOnAnimesChange,
} = store;

function fatalError(msg) {
  msgError.value = msg;
  error.value = true;
}

function update() {
  loading.value = true;
  const valueToSearch = textToSearch.value.toLowerCase();

  getAllUsers()
    .then((usersData) => {
      const usernames = usersData.map((_user) => _user.username);
      const foundUsersAux = usernames.filter((name) => name.toLowerCase().includes(valueToSearch));
      foundUsers.value = foundUsersAux;
      loading.value = false;
    })
    .catch(() => {
      fatalError('Something is wrong! :-(');
    });
}

function init() {
  error.value = false;
  loading.value = false;
  msgError.value = '';

  if (user.value == null) {
    router.push('/login');
  }

  assignActionOnUsersChange(() => {});
  assignActionOnAnimesChange(() => {});

  update();
}

onMounted(init);

</script>
