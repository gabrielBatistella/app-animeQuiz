<template>
  <q-card class='q-ma-md' width='auto'>
    <q-img :src='background' class='fit'>
      <q-carousel
        class='fit no-padding'
        style='background-color:rgba(0, 255, 255, 0);'
        v-model='showingDescription'
        vertical
        transition-prev='slide-down'
        transition-next='slide-up'
        animated>
        <q-carousel-slide name='title' class='fit no-padding'>
          <q-img class='fit'>
            <div class='absolute-bottom text-h3 text-center'>
              {{ title }}
            </div>
            <q-icon class='absolute-top-right q-ma-sm'
              name='help'
              @click='showingDescription = "description"'
              v-ripple.center
              color='dark'
              size='xl'
              style='opacity:0.75;' />
          </q-img>
        </q-carousel-slide>
        <q-carousel-slide name='description' class="fit no-padding">
          <q-img class='fit'>
            <div class='fit'>
              <span class='absolute-top q-mt-md text-h3 text-center'>
                {{ title }}
              </span>
              <span class='absolute-center text-h5 text-center'>
                {{ description }}
              </span>
              <q-icon class='absolute-top-right q-ma-sm'
                name='expand_more'
                @click='showingDescription = "title"'
                v-ripple.center
                color='white'
                size='xl'
                style='opacity:0.75;' />
            </div>
          </q-img>
        </q-carousel-slide>
      </q-carousel>
    </q-img>
  </q-card>
</template>

<script setup>
import { ref, defineProps } from 'vue';

defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    default() {
      return 'No description available';
    },
  },
  background: {
    type: String,
    default() {
      return '/test_image.jpg';
    },
  },
});

const showingDescription = ref('title');

</script>
