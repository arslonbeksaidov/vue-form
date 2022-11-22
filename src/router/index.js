import PageThreadShow from '@/pages/ThreadShow'
import PageHome from '@/pages/Home'
import ThreadCreate from '@/pages/ThreadCreate'
import PageNotFound from '@/pages/NotFound'
import { createRouter, createWebHistory } from 'vue-router'
import dataJson from '@/data.json'
import Form from '@/pages/Form'
import Category from '@/pages/Category'
import Profile from '@/pages/Profile'

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
    path: '/forum/:forumId/thread/create',
    name: 'ThreadCreate',
    component: ThreadCreate,
    props: true
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: PageNotFound
  },
  {
    path: '/form/:id',
    name: 'Form',
    component: Form,
    props: true
  },
  {
    path: '/me',
    name: 'ProfilePage',
    component: Profile,
    meta: {
      toTop: true,
      smoothScroll: true
    }
  },
  {
    path: '/me/edit',
    name: 'ProfilePageEdit',
    component: Profile,
    props: { edit: true }
  },
  {
    path: '/category/:id',
    name: 'Category',
    component: Category,
    props: true
  }
]

export default createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
