import { makeAppendChildToParentMutation } from '@/helpers'

export default {
  namespaced: true,
  state: {
    items: []
  },
  getters: {},
  actions: {
    fetchForum: ({ dispatch }, { id }) => dispatch('fetchItem', { resource: 'forums', id, emoji: '44' }, { root: true }),
    fetchForums: ({ dispatch }, { ids }) => dispatch('fetchItems', { resource: 'forums', ids, emoji: 'forum' }, { root: true })
  },
  mutations: {
    appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' })
  }
}
