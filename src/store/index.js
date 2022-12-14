import { createStore } from 'vuex'
import 'firebase/compat/firestore'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import categories from '@/store/modules/categories'
import users from '@/store/modules/users'
import posts from '@/store/modules/posts'
import forums from '@/store/modules/forums'
import threads from '@/store/modules/threads'
import auth from '@/store/modules/auth'
export default createStore({
  modules: {
    categories,
    users,
    posts,
    forums,
    threads,
    auth
  },
  state: {
    unsubscribes: []
  },
  getters,
  actions,
  mutations
})
