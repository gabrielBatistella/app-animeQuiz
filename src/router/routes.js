import MainLayout from 'layouts/MainLayout';
import EmptyLayout from 'layouts/EmptyLayout';

import LoginView from 'pages/LoginView';
import MainMenuView from 'pages/MainMenuView';
import AnimePageView from 'pages/AnimePageView';

const routes = [
  {
    path: '/login',
    component: EmptyLayout,
    children: [
      { path: '', component: LoginView },
    ],
  },
  {
    path: '/home',
    component: MainLayout,
    children: [
      { path: '', component: MainMenuView },
    ],
  },
  {
    path: '/anime',
    component: MainLayout,
    children: [
      { path: ':id', component: AnimePageView },
    ],
  },
];

export default routes;
