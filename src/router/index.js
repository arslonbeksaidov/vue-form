import PageThreadShow from '@/pages/ThreadShow'
import PageHome from '@/pages/Home'
import ThreadCreate from '@/pages/ThreadCreate'
import PageNotFound from '@/pages/NotFound'
import { createRouter, createWebHistory } from 'vue-router'
import Form from '@/pages/Form'
import Category from '@/pages/Category'
import Profile from '@/pages/Profile'
import ThreadEdit from '@/pages/ThreadEdit'
import store from '@/store'
import Register from '@/pages/Register'
import SignIn from '@/pages/SignIn'
import { findById } from '@/helpers'

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
    async beforeEnter (to, from, next) {
      await store.dispatch('threads/fetchThread', { id: to.params.id })
      const threadExists = findById(store.state.threads.items, to.params.id)
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
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/thread/:id/edit',
    name: 'ThreadEdit',
    component: ThreadEdit,
    props: true,
    meta: {
      requiresAuth: true
    }
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
      smoothScroll: true,
      requiresAuth: true
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
  },
  {
    path: '/register',
    name: 'Register',
    component: Register,
    meta: {
      requiresGuest: true
    }
  },
  {
    path: '/logout',
    name: 'SignOut',
    async beforeEnter (to, from) {
      await store.dispatch('auth/signOut')
      return { name: 'Home' }
    }
  },
  {
    path: '/signin',
    name: 'SignIn',
    component: SignIn,
    meta: {
      requiresGuest: true
    }
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior (to) {
    const scroll = {}
    if (to.meta.toTop) scroll.top = 0
    if (to.meta.smoothScroll) scroll.behavior = 'smooth'
    return scroll
  }
})
router.beforeEach(async (to, from) => {
  await store.dispatch('auth/initAuthentication')
  if (to.meta.requiresAuth && !store.state.auth.authId) {
    return { name: 'SignIn', query: { redirectTo: to.path } }
  }
  if (to.meta.requiresGuest && store.state.auth.authId) {
    return { name: 'Home' }
  }
  console.log(`message to ${to.name} from ${from.name}`)
  store.dispatch('unsubscribeAllSnapshots')
})
export default router
