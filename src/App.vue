<template>
  <div id="q-app">
    <router-view/>
  </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
  name: 'App',

  methods: {
    ...mapActions(['assignActionOnAnimesChange', 'assignActionOnUsersChange']),
  },

  created() {
    /* this.$router.onReady(() => {
      this.$router.afterEach((to, from) => {
        this.assignActionOnUsersChange(() => {});
        this.assignActionOnAnimesChange(() => {});
        console.log(`To: ${to.path}; From: ${from.path}`);
      });
    }); */
  },
};

</script>
