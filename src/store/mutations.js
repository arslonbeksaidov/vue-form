import { upsert, docToResource } from '@/helpers'

export default {
  setItem (state, { resource, item }) {
    upsert(state[resource].items, docToResource(item))
  },
  appendUnsubcribe (state, { unsubcribe }) {
    state.unsubscribes.push(unsubcribe)
  },
  clearAllUnsubcribes (state) {
    state.unsubscribes = []
  }
}
