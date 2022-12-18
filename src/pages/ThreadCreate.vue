<template>
  <div v-if="forum" class="col-full push-top">

    <h1>Create new thread in <i>{{ forum.name }}</i></h1>

    <ThreadEditor @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import { mapActions } from 'vuex'

export default {
  name: 'ThreadCreate',
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  computed: {
    forum () {
      return this.$store.state.forums.find(forum => forum.id === this.forumId)
    }
  },
  methods: {
    ...mapActions(['fetchForum', 'createThread']),
    async save ({ title, text }) {
      const thread = await this.createThread({
        forumId: this.forumId,
        title,
        text
      })
      this.$router.push({ name: 'ThreadShow', params: { id: thread.id } })
    },
    cancel () {
      this.$router.push({ name: 'Forum', params: { id: this.forum.id } })
    }
  },
  created () {
    this.fetchForum({ id: this.forumId })
  }
}
</script>

<style scoped>

</style>
