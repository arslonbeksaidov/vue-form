import PageThreadShow from '@/pages/ThreadShow'
import PageHome from '@/pages/Home'
import PageNotFound from '@/pages/NotFound'
import { createRouter, createWebHistory } from 'vue-router'
import dataJson from '@/data.json'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: PageHome
  },
  {
    path: '/thread/:id',
    name: 'ThreadShow',
    props: route => ({ id: route.params.id }),
    component: PageThreadShow,
    beforeEnter (to, from, next) {
      const threadExists = dataJson.threads.find(thread => thread.id === to.params.id)
      if (threadExists) {
        return next()
      } else {
        next({
          name: 'NotFound',
          params: { pathMatch: to.path.substring(1).split('/') },
          query: to.query,
          hash: to.hash
        })
      }
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFound
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
