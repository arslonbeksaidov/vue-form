import { docToResource, findById, makeAppendChildToParentMutation } from '@/helpers'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'

export default {
  namespaced: true,
  state: {
    items: [] // state.threads.items
  },
  getters: {
    thread: (state, getters, rootState) => {
      return (id) => {
        const thread = findById(state.items, id)
        if (!thread) {
          return {}
        }
        return {
          ...thread,
          get author () {
            return findById(rootState.users.items, thread.userId)
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
    async createThread ({ commit, state, dispatch, rootState }, { text, title, forumId }) {
      const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
      const userId = rootState.auth.authId
      const threadRef = firebase.firestore().collection('threads').doc()
      const thread = { forumId, publishedAt, title, userId, id: threadRef.id }

      const batch = firebase.firestore().batch()
      const userRef = firebase.firestore().collection('users').doc(userId)
      const forumRef = firebase.firestore().collection('forums').doc(forumId)

      batch.set(threadRef, thread)
      batch.update(userRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      batch.update(forumRef, {
        threads: firebase.firestore.FieldValue.arrayUnion(threadRef.id)
      })
      await batch.commit()
      const newThread = await threadRef.get()

      commit('setItem', {
        resource: 'threads', item: { ...newThread.data(), id: newThread.id }
      },
      { root: true }
      )
      commit('forums/appendThreadToForum', { parentId: forumId, childId: threadRef.id }, { root: true })
      commit('users/appendThreadToUser', { parentId: userId, childId: threadRef.id }, { root: true })
      await dispatch('posts/createPost', { text, threadId: threadRef.id }, { root: true })
      return findById(state.items, threadRef.id)
    },
    async updateThread ({ commit, state, rootState }, { title, text, id }) {
      const thread = findById(state.items, id)
      const post = findById(rootState.posts.items, thread.posts[0])
      let newThread = { ...thread, title }
      let newPost = { ...post, text }
      const threadRef = firebase.firestore().collection('threads').doc(id)
      const postsRef = firebase.firestore().collection('posts').doc(post.id)
      const batch = firebase.firestore().batch()
      batch.update(threadRef, newThread)
      batch.update(postsRef, newPost)
      await batch.commit()
      newThread = await threadRef.get()
      newPost = await postsRef.get()
      commit('setItem', { resource: 'threads', item: newThread }, { root: true })
      commit('setItem', { resource: 'posts', item: newPost }, { root: true })
      return docToResource(newThread)
    },
    fetchThread: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'threads', id, emoji: '11' }, { root: true }),
    fetchThreads: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'threads', ids, emoji: 'patoq' }, { root: true })
  },
  mutations: {
    appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
    appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })

  }
}
