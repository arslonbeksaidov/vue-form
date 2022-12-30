import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
export default {
  fetchItem ({ state, commit }, { id, emoji, resource, handleUnsubcribe = null }) {
    return new Promise((resolve) => {
      const unsubcribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        if (doc.exists) {
          const item = { ...doc.data(), id: doc.id }
          commit('setItem', { resource, item })
          resolve(item)
        } else {
          resolve(null)
        }
      })
      if (handleUnsubcribe) {
        handleUnsubcribe(unsubcribe)
      } else {
        commit('appendUnsubcribe', { unsubcribe })
      }
    })
  },
  fetchItems ({ dispatch }, { ids, resource, emoji }) {
    console.log(emoji)
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
  },
  async unsubscribeAllSnapshots ({ state, commit }) {
    state.unsubscribes.forEach(unsubcribe => unsubcribe())
    commit('clearAllUnsubcribes')
  }

}
