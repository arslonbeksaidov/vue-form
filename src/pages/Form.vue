<template>
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
</template>

<script>
import ThreadList from '@/components/ThreadList'
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
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.id)
    },
    threads () {
      if (!this.forum) return []
      return this.forum.threads.map(threadId => this.$store.getters.thread(threadId)).filter(thread => thread.id)
    }
  },
  async created () {
    const forum = await this.$store.dispatch('fetchForum', { id: this.id })
    const threads = await this.$store.dispatch('fetchThreads', { ids: forum.threads })
    const users = await this.$store.dispatch('fetchUsers', { ids: threads.map(thread => thread.userId) })
    console.log(users)
  }
}
</script>

<style scoped>

</style>
