<template>
  <div class="container" v-if="asyncDataStatus_ready">
  <div class="container">
    <div v-if="forum" class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details ">
          <h1>{{forum.name}}</h1>
          <p class="text-lead">{{forum.description}}</p>
        </div>
        <router-link :to="{ name: 'ThreadCreate', params: { forumId: forum.id }}" class="btn-green btn-small">Start a thread</router-link>
      </div>
    </div>

    <div class="col-full push-top">
      <ThreadList :threads="threads"/>
    </div>

  </div>
  </div>
</template>

<script>
import ThreadList from '@/components/ThreadList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  name: 'FormPage',
  components: {
    ThreadList
  },
  mixins: [asyncDataStatus],
  computed: {
    forum () {
      return this.$store.state.forums.items.find(forum => forum.id === this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.$store.getters['threads/thread'](threadId)).filter(thread => thread.id)
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['fetchThreads']),
    ...mapActions('users', ['fetchUsers'])
  },
  async created () {
    const forum = await this.fetchForum({ id: this.id })
    const threads = await this.fetchThreads({ ids: forum.threads })
    await this.fetchUsers({ ids: threads.map(thread => thread.userId) })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
