import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomePage from '../views/HomePage.vue'
import PresencePage from '../views/PresencePage.vue';
import ValidationPage from '../views/ValidationPage.vue';
import InfoCandidat from '../views/InfoCandidat.vue';
import SuccessState from '../views/SuccessState.vue';
import ProcessEnd from '../views/ProcessEnd.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/presences',
    name: 'Presences',
    component: PresencePage
  },
  {
    path: '/validations',
    name: 'Validations',
    component: ValidationPage
  },
  {
    path: '/details/:type/:id',
    name: 'Details',
    component: InfoCandidat
  },
  {
    path: '/success-state/:type',
    name: 'SuccessState',
    component: SuccessState
  },
  {
    path: '/process-end',
    name: 'ProcessEnd',
    component: ProcessEnd
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
