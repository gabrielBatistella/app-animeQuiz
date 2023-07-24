import MainLayout from 'layouts/MainLayout';
import EmptyLayout from 'layouts/EmptyLayout';

import LoginView from 'pages/LoginView';
import MainMenuView from 'pages/MainMenuView';
import AnimePageView from 'pages/AnimePageView';
import UserPageView from 'pages/UserPageView';
import LeaderboardView from 'pages/LeaderboardView';
import CompetitiveGameView from 'pages/CompetitiveGameView';
import CasualGameView from 'pages/CasualGameView';

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
  {
    path: '/user',
    component: MainLayout,
    children: [
      { path: ':username', component: UserPageView },
    ],
  },
  {
    path: '/leaderboard',
    component: MainLayout,
    children: [
      { path: '', component: LeaderboardView },
    ],
  },
  {
    path: '/play',
    component: MainLayout,
    children: [
      { path: 'competitive', component: CompetitiveGameView },
      { path: 'casual', component: CasualGameView },
    ],
  },
];

export default routes;
