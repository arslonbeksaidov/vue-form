import { findById, upsert, docToResource } from '@/helpers'

export default {
  setAuthId (state, id) {
    state.authId = id
  },
  setAuthUserUnsubcribe (state, unsubcribe) {
    state.authUserUnsubcribe = unsubcribe
  },
  setItem (state, { resource, item }) {
    upsert(state[resource], docToResource(item))
  },
  appendUnsubcribe (state, { unsubcribe }) {
    state.unsubscribes.push(unsubcribe)
  },
  clearAllUnsubcribes (state) {
    state.unsubscribes = []
  },
  appendPostToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'posts' }),
  appendThreadToForum: makeAppendChildToParentMutation({ parent: 'forums', child: 'threads' }),
  appendThreadToUser: makeAppendChildToParentMutation({ parent: 'users', child: 'threads' }),
  appendContributorToThread: makeAppendChildToParentMutation({ parent: 'threads', child: 'contributors' })
}
function makeAppendChildToParentMutation ({ parent, child }) {
  return (state, { childId, parentId }) => {
    console.log([parent, '====='])
    console.log(state[parent], '----')
    const resource = findById(state[parent], parentId)
    if (!resource) {
      console.warn(`Appending ${child} ${childId} ${parent} ${parentId} failed because the parent didn't exist`)
    }
    console.log(resource[child])
    resource[child] = resource[child] || []
    if (!resource[child].includes(childId)) {
      resource[child].push(childId)
    }
  }
}
