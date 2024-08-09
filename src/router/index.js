import {createRouter, createWebHashHistory} from 'vue-router'
import Home from '../views/Home.vue'
import WriterLogin from '../views/WriterLogin.vue'
import WriterProfile from '../views/WriterProfile.vue'
import WriterHome from '../views/WriterHome.vue'
import WriterView from '../views/WriterView.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: {
        title: 'Home'
      }
    },
    {
      path: '/writer-home',
      name: 'WriterHome',
      component: WriterHome,
      meta: {
        title: 'WriterHome'
      }
    },
    {
      path: '/writer-view',
      name: 'WriterView',
      component: WriterView,
      meta: {
        title: 'WriterView'
      }
    },
    {
      path: '/writer-login',
      name: 'WriterLogin',
      component: WriterLogin,
      meta: {
        title: 'WriterLogin'
      }
    },
    {
      path: '/writer-profile',
      name: 'WriterProfile',
      component: WriterProfile,
      meta: {
        title: 'WriterProfile'
      }
    }
  ]
})

const DEFAULT_TITLE = 'TITLE';

router.afterEach((to) => {
  document.title = to.meta.title ?? DEFAULT_TITLE
})

export default router
