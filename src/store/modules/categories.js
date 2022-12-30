import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem',
      { resource: 'categories', id, emoji: '22' }, { root: true }),
    fetchAllCategories ({ commit }) {
      return new Promise((resolve) => {
        firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
          const categories = querySnapshot.docs.map(doc => {
            const item = {
              id: doc.id,
              ...doc.data()
            }
            commit('setItem', { resource: 'categories', item }, { root: true })
            return item
          })
          resolve(categories)
        })
      })
    },
    fetchCategories: ({ dispatch }, { ids }) => dispatch('fetchItems',
      { resource: 'categories', ids, emoji: 'categories emoji' },
      { root: true }
    )
  },
  mutations: {}
}
