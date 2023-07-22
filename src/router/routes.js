import MainLayout from 'layouts/MainLayout';
import PageIndex from 'pages/Index.vue';
import AnimePageView from 'pages/AnimePageView';

const routes = [
  {
    path: '',
    component: MainLayout,
    props: { teste: true },
    children: [
      { path: '', component: PageIndex },
      { path: 'anime/:id', component: AnimePageView },
    ],
  },
];

export default routes;
