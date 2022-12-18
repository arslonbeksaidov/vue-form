import { createStore } from 'vuex'
import 'firebase/compat/firestore'
import getters from '@/store/getters'
import actions from '@/store/actions'
import mutations from '@/store/mutations'
import state from '@/store/state'
export default createStore({
  getters,
  mutations,
  state,
  actions
})
