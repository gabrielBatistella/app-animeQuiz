import Vue from 'vue';
import VueRouter from 'vue-router';

import MainLayout from 'layouts/MainLayout.vue';
import PageIndex from 'pages/Index.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    component: MainLayout,
    props: { teste: true },
    children: [
      { path: '', component: PageIndex },
    ],
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
