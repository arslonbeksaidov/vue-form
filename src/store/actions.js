import { findById } from '@/helpers'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'

export default {
  createPost ({ commit, state }, post) {
    post.id = 'qqqq' + Math.random()
    post.publishedAt = Math.floor(Date.now() / 1000)
    post.userId = state.authId
    commit('setItem', { resource: 'posts', item: post })
    commit('appendPostToThread', { childId: post.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const id = 'trtrtr' + Math.random()
    const publishedAt = Math.floor(Date.now() / 1000)
    const userId = state.authId
    const thread = { forumId, publishedAt, title, userId, id }
    commit('setItem', { resource: 'threads', item: thread })
    commit('appendThreadToForum', { parentId: forumId, childId: id })
    commit('appendThreadToUser', { parentId: userId, childId: id })
    dispatch('createPost', { text, threadId: id })
    return findById(state.threads, id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
    const nextThread = { ...thread, title }
    const nextPost = { ...post, text }
    commit('setItem', { resource: 'threads', item: nextThread })
    commit('setItem', { resource: 'posts', item: nextPost })
    return thread
  },
  updateUser ({ commit }, user) {
    commit('setItem', { resource: 'users', item: user })
  },
  /*
  * fetch single resource
  */
  fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '11' }),
  fetchUser: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'users', id, emoji: '22' }),
  fetchCategory: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'categories', id, emoji: '22' }),
  fetchPost: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'posts', id, emoji: '33' }),
  fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '44' }),
  /*
  * fetch multiple resources
  */
  fetchAllCategories ({ commit }) {
    return new Promise((resolve) => {
      firebase.firestore().collection('categories').onSnapshot((querySnapshot) => {
        const categories = querySnapshot.docs.map(doc => {
          const item = {
            id: doc.id,
            ...doc.data()
          }
          commit('setItem', { resource: 'categories', item })
          return item
        })
        resolve(categories)
      })
    })
  },
  fetchPosts: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'posts', ids, emoji: 'post' }),
  fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: 'patoq' }),
  fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: 'forum' }),
  fetchUsers: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'users', ids, emoji: 'odam' }),
  /*
  * fetch item and items universally
  */
  fetchItem ({ state, commit }, { id, emoji, resource }) {
    console.log(emoji)
    return new Promise((resolve) => {
      firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, id, item })
        resolve(item)
      })
    })
  },
  fetchItems ({ dispatch }, { ids, resource, emoji }) {
    console.log(emoji)
    return Promise.all(ids.map(id => dispatch('fetchItem', { id, resource, emoji })))
  }
}
