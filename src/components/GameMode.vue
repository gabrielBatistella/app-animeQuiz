<template>
  <q-card class="shadow-24" width="auto">
    <q-img :src="background" class="fit">
      <q-carousel class="fit no-padding"
        style="background-color:rgba(0, 255, 255, 0);"
        v-model="showingDescription"
        vertical
        transition-prev="slide-down"
        transition-next="slide-up"
        animated>
        <q-carousel-slide name="title" class="fit no-padding">
          <q-img class="fit cursor-pointer q-hoverable"
            @click="$emit('enterGame')"
            v-ripple>
            <div class="absolute-bottom text-h4 text-center">
              {{ title }}
            </div>
          </q-img>
          <q-icon class="absolute-top-left q-ma-sm"
            name="help"
            @click="showingDescription = 'description'"
            color="dark"
            size="xl"
            style="opacity:0.75;" />
        </q-carousel-slide>
        <q-carousel-slide name="description" class="fit no-padding">
          <q-img class="fit">
            <div class="fit row wrap justify-center items-center content-center q-px-xl">
              <div class="absolute-top text-h4 q-mt-md text-center">
                {{ title }}
              </div>
              <div class="text-subtitle2 q-mt-lg text-center">
                <span v-for="line in descriptionFormatted" :key="line.index">
                  {{ line.content }} <br>
                </span>
              </div>
            </div>
          </q-img>
          <q-icon class="absolute-top-left q-ma-sm"
            name="expand_more"
            @click="showingDescription = 'title'"
            v-ripple.center
            color="white"
            size="xl"
            style="opacity:0.75;" />
        </q-carousel-slide>
      </q-carousel>
    </q-img>
  </q-card>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
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

defineEmits({
  enterGame: null,
});

const showingDescription = ref('title');

const descriptionFormatted = computed(() => {
  const formatted = [];
  props.description.split('\n').forEach((line) => {
    formatted.push({
      index: formatted.length,
      content: line,
    });
  });
  return formatted;
});

</script>
