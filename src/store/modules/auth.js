import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

export default {
  namespaced: true,
  state: {
    authId: null,
    authUserUnsubcribe: null,
    authObserverUnsubcribe: null
  },
  getters: {
    authUser: (state, getters, rootState, rootGetters) => {
      return rootGetters['users/user'](state.authId)
    }
  },
  actions: {
    initAuthentication ({ dispatch, commit, state }) {
      if (state.authObserverUnsubcribe) state.authObserverUnsubcribe()
      return new Promise((resolve) => {
        const unsubcribe = firebase.auth().onAuthStateChanged(async (user) => {
          console.log('user state changed')
          this.dispatch('auth/unsubcribeAuthUserSnapshot')
          if (user) {
            await this.dispatch('auth/fetchAuthUser')
            resolve(user)
          } else {
            resolve(null)
          }
        })
        commit('setAuthObserverUnsubscribe', unsubcribe)
      })
    },
    async registerUserWithEmailAndPassword ({ dispatch }, { avatar = null, email, name, username, password }) {
      const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
      await dispatch('users/createUser', { id: result.user.uid, email, name, username, avatar }, { root: true })
      await dispatch('fetchAuthUser')
    },
    async signInWithEmailAndPassword ({ dispatch }, { password, email }) {
      return firebase.auth().signInWithEmailAndPassword(email, password)
    },
    async signOut ({ commit }) {
      await firebase.auth().signOut()
      commit('setAuthId', null)
    },
    async signInWithGmail ({ dispatch }) {
      const provider = new firebase.auth.GoogleAuthProvider()
      const response = await firebase.auth().signInWithPopup(provider)
      const user = response.user
      const userRef = firebase.firestore().collection('users').doc(user.uid)
      const userDoc = userRef.get()
      if (!userDoc.exists) {
        return dispatch('users/createUser', {
          id: user.uid,
          name: user.displayName,
          email: user.email,
          username: user.email,
          avatar: user.photoURL
        }, { root: true }
        )
      }
    },
    fetchAuthUser: async ({ dispatch, state, commit }) => {
      const userId = firebase.auth().currentUser?.uid
      if (!userId) return
      await dispatch('fetchItem', {
        resource: 'users',
        id: userId,
        handleUnsubcribe: (unsubcribe) => {
          commit('setAuthUserUnsubscribe', unsubcribe)
        }
      }, { root: true })
      commit('setAuthId', userId)
    },
    async fetchAuthUserPosts ({ commit, state }) {
      const posts = await firebase.firestore().collection('posts').where('userid', '==', state.authId).get()
      posts.forEach(item => {
        commit('setItem', { resource: item }, { root: true })
      })
    },
    async unsubcribeAuthUserSnapshot ({ state, commit }) {
      if (state.authUserUnsubcribe) {
        state.authUserUnsubcribe()
        commit('setAuthUserUnsubscribe', null)
      }
    }
  },
  mutations: {
    setAuthId (state, id) {
      state.authId = id
    },
    setAuthUserUnsubscribe (state, unsubcribe) {
      state.authUserUnsubcribe = unsubcribe
    },
    setAuthObserverUnsubscribe (state, unsubcribe) {
      state.authObserverUnsubcribe = unsubcribe
    }
  }
}
