<template>
  <q-card class="absolute-center bg-blue-grey-10 text-white">
    <q-card-section class="text-center">
      <span class="text-h5">
        Login/Register
      </span>
    </q-card-section>
    <q-card-section>
      <q-form class="q-gutter-md">
        <div>
          <span class="text-h6">
            Username:
          </span>
          <q-input
            ref="usernameRef"
            dark
            square
            filled
            outlined
            v-model="username"
            :rules="usernameRules"
            lazy-rules
            label="Username" />
        </div>
        <div>
          <span class="text-h6">
            Password:
          </span>
          <q-input
            ref="passwordRef"
            dark
            square
            filled
            outlined
            v-model="password"
            label="Password"
            :type="isPwd ? 'password' : 'text'"
            :rules="passwordRules"
            lazy-rules>
            <template v-slot:append>
              <q-icon
                :name="isPwd ? 'visibility_off' : 'visibility'"
                class="cursor-pointer"
                @click="isPwd = !isPwd" />
            </template>
          </q-input>
        </div>
        <div v-if="msgError != ''" class="text-center">
          <span class="text-red">
            {{ msgError }}
          </span>
        </div>
        <div class="row wrap justify-around items-start content-start">
          <q-btn
            label="Login"
            color="blue-10"
            @click="loginEmit()" />
          <q-btn
            label="Register"
            color="blue-10"
            flat
            class="q-ml-sm"
            @click="registerEmit()" />
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { ref } from 'vue';

defineProps({
  msgError: {
    type: String,
    default() {
      return '';
    },
  },
});

const emit = defineEmits({
  login: null,
  register: null,
  setNewError: null,
});

const isPwd = ref('password');

const username = ref('');
const usernameRef = ref(null);
const usernameRules = [
  (name) => name.length > 0 || 'Please, type an username!',
  (name) => name.length >= 3 || 'Username needs to contain at least 3 characters!',
  (name) => !name.includes(' ') || 'Username cannot contain spaces!',
  (name) => name.at(0) !== '_' || 'Username cannot start the _ symbol!',
];

const password = ref('');
const passwordRef = ref(null);
const passwordRules = [
  (word) => word.length > 0 || 'Please, type a password!',
  (word) => word.length >= 8 || 'Password needs to contain at least 8 characters!',
];

function loginEmit() {
  usernameRef.value.validate();
  passwordRef.value.validate();

  if (usernameRef.value.hasError || passwordRef.value.hasError) {
    emit('setNewError', 'Review your data and try again!');
    return;
  }
  emit('loginEvent', username.value, password.value);
}

function registerEmit() {
  usernameRef.value.validate();
  passwordRef.value.validate();

  if (usernameRef.value.hasError || passwordRef.value.hasError) {
    emit('setNewError', 'Review your data and try again!');
    return;
  }
  emit('registerEvent', username.value, password.value);
}

</script>
