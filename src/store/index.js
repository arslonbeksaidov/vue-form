import { createStore } from 'vuex'
import jsonData from '@/data.json'
export default createStore({
  state: {
    ...jsonData,
    authId: 'FsCDAk9w8NeXEceLV87arpsXjnQ2'
  },
  getters: {
    authUser: state => {
      const user = state.users.find(user => user.id === state.authId)
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
  actions: {
    createPost ({ commit, state }, post) {
      post.id = 'qqqq' + Math.random()
      post.publishedAt = Math.floor(Date.now() / 1000)
      post.userId = state.authId
      commit('setPost', { post })
      commit('appendPostToThread', { postId: post.id, threadId: post.threadId })
    },
    updateUser ({ commit }, user) {
      commit('setUser', { user, userId: user.id })
    }
  },
  mutations: {
    setPost (state, { post }) {
      state.posts.push(post)
    },
    appendPostToThread (state, { postId, threadId }) {
      const thread = state.threads.find(thread => thread.id === threadId)
      thread.posts.push(postId)
    },
    setUser (state, { user, userId }) {
      const userIndex = state.users.findIndex(user => user.id === userId)
      state.users[userIndex] = user
    }
  }
})
