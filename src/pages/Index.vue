<template>
  <q-page>
    <GameMode title='Sei Lá' />
    <error></error>
    <LoadingIcon></LoadingIcon>
  </q-page>
</template>

<script>
import GameMode from 'src/components/GameMode';
import LoadingIcon from 'src/components/LoadingIcon';
import Error from 'src/components/Error';

export default {
  name: 'PageIndex',

  components: {
    GameMode,
    LoadingIcon,
    Error,
  },

  data() {
    return {
      slide: 'image',
      size: 200,
      controlType: 0,
    };
  },

  methods: {
  },
};
</script>
