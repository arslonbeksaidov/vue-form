import { docToResource, findById } from '@/helpers'
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import 'firebase/compat/auth'
export default {
  async createPost ({ commit, state }, post) {
    post.userId = state.authId
    post.publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const batch = firebase.firestore().batch()
    const postRef = firebase.firestore().collection('posts').doc()
    const threadRef = firebase.firestore().collection('threads').doc(post.threadId)
    const userRef = firebase.firestore().collection('users').doc(state.authId)
    batch.set(postRef, post)
    batch.update(threadRef, {
      posts: firebase.firestore.FieldValue.arrayUnion(postRef.id),
      contributors: firebase.firestore.FieldValue.arrayUnion(state.authId)
    })
    batch.update(userRef, {
      postsCount: firebase.firestore.FieldValue.increment(1)
    })
    await batch.commit()
    const newPost = await postRef.get()
    commit('setItem', { resource: 'posts', item: { ...newPost.data(), id: newPost.id } })
    commit('appendPostToThread', { childId: newPost.id, parentId: post.threadId })
    commit('appendContributorToThread', { childId: state.authId, parentId: post.threadId })
  },
  async updatePost ({ commit, state, dispatch }, { text, id }) {
    const post = {
      text,
      edited: {
        at: firebase.firestore.FieldValue.serverTimestamp(),
        by: state.authId,
        moderated: false
      }
    }
    const postRef = firebase.firestore().collection('posts').doc(id)
    await postRef.update(post)
    const updatePost = await postRef.get()
    commit('setItem', { resource: 'posts', item: updatePost })
  },
  async createThread ({ commit, state, dispatch }, { text, title, forumId }) {
    const publishedAt = firebase.firestore.FieldValue.serverTimestamp()
    const userId = state.authId
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

    commit('setItem', { resource: 'threads', item: { ...newThread.data(), id: newThread.id } })
    commit('appendThreadToForum', { parentId: forumId, childId: threadRef.id })
    commit('appendThreadToUser', { parentId: userId, childId: threadRef.id })
    await dispatch('createPost', { text, threadId: threadRef.id })
    return findById(state.threads, threadRef.id)
  },
  async updateThread ({ commit, state }, { title, text, id }) {
    const thread = findById(state.threads, id)
    const post = findById(state.posts, thread.posts[0])
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
    commit('setItem', { resource: 'threads', item: newThread })
    commit('setItem', { resource: 'posts', item: newPost })
    return docToResource(newThread)
  },
  async registerUserWithEmailAndPassword ({ dispatch }, { avatar = null, email, name, username, password }) {
    const result = await firebase.auth().createUserWithEmailAndPassword(email, password)
    await dispatch('createUser', { id: result.user.uid, email, name, username, avatar })
    await dispatch('fetchAuthUser')
  },
  async signInWithEmailAndPassword ({ dispatch }, { password, email }) {
    return firebase.auth().signInWithEmailAndPassword(email, password)
  },
  async signOut ({ commit }) {
    await firebase.auth().signOut()
    commit('setAuthId', null)
  },
  async signWithGmail ({ dispatch }) {
    const provider = new firebase.auth.GoogleAuthProvider()
    const response = await firebase.auth().signInWithPopup(provider)
    const user = response.user
    const userRef = firebase.firestore().collection('users').doc(user.uid)
    const userDoc = userRef.get()
    if (!userDoc.exists) {
      return dispatch('createUser', {
        id: user.uid,
        name: user.displayName,
        email: user.email,
        username: user.email,
        avatar: user.photoURL
      })
    }
  },
  async createUser ({ commit }, { id, email, name, username, avatar = null }) {
    const registeredAt = firebase.firestore.FieldValue.serverTimestamp()
    const usernameLower = username.toLowerCase()
    email = email.toLowerCase()
    const user = { avatar, email, name, username, usernameLower, registeredAt }
    const userRef = await firebase.firestore().collection('users').doc(id)
    userRef.set(user)
    const newUser = await userRef.get()
    commit('setItem', { resource: 'users', item: newUser })
    return docToResource(newUser)
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
  fetchAuthUser: ({ dispatch, state, commit }) => {
    const userId = firebase.auth().currentUser?.uid
    if (!userId) return
    dispatch('fetchItem', { resource: 'users', id: userId, emoji: '22' })
    commit('setAuthId', userId)
  },
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
      const unsubcribe = firebase.firestore().collection(resource).doc(id).onSnapshot((doc) => {
        const item = { ...doc.data(), id: doc.id }
        commit('setItem', { resource, item })
        resolve(item)
      })
      commit('appendUnsubcribe', { unsubcribe })
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
