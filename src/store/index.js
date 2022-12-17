import { createStore } from 'vuex'
// import jsonData from '@/data.json'
import { findById, upsert } from '@/helpers'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import { commit } from 'lodash/seq'

export default createStore({
  state: {
    // ...jsonData,
    categories: [],
    forums: [],
    users: [],
    threads: [],
    posts: [],
    authId: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
  },
  getters: {
    authUser: (state, getters) => {
      return getters.user(state.authId)
    },
    user: state => {
      return (id) => {
        const user = findById(state.users, id)
        if (!user) return null
        return {
          ...user,
          get posts () {
            return state.posts.filter(post => post.userId === user.id)
          },
          get postsCount () {
            return this.posts.length
          },
          get threadsCount () {
            return this.threads.length
          },
          get threads () {
            return state.threads.filter(thread => thread.userId === user.id)
          }
        }
      }
    },
    thread: state => {
      return (id) => {
        const thread = findById(state.threads, id)
        if (!thread) {
          return {}
        }
        return {
          ...thread,
          get author () {
            return findById(state.users, thread.userId)
          },
          get repliesCount () {
            return thread.posts.length - 1
          },
          get contributorsCount () {
            return thread.contributors.length
          }
        }
      }
    }
  },
  actions: {
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
    fetchThread ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'threads', id, emoji: '11' })
    },
    fetchUser ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'users', id, emoji: '22' })
    },
    fetchPost ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'posts', id, emoji: '33' })
    },
    fetchForum ({ dispatch }, { id }) {
      return dispatch('fetchItem', { resource: 'forums', id, emoji: '44' })
    },
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
    fetchPosts ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'posts', ids, emoji: 'post' })
    },
    fetchThreads ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'threads', ids, emoji: 'patoq' })
    },
    fetchForums ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'forums', ids, emoji: 'forum' })
    },
    fetchUsers ({ dispatch }, { ids }) {
      return dispatch('fetchItems', { resource: 'users', ids, emoji: 'odam' })
    },
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
  },
  mutations: {
    setItem (state, { resource, item }) {
      upsert(state[resource], item)
    },
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
    appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
  }
})

function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    const resource = findById(state[parent], parentId)
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
