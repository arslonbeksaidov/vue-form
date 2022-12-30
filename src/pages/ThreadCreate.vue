<template>
  <div v-if="asyncDataStatus_ready" class="col-full push-top">

    <h1>Create new thread in <i>{{ forum.name }}</i></h1>

    <ThreadEditor @dirty="formIsDirty = true" @clean="formIsDirty = false" @save="save" @cancel="cancel"/>
  </div>
</template>

<script>
import ThreadEditor from '@/components/ThreadEditor'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'

export default {
  name: 'ThreadCreate',
  components: { ThreadEditor },
  props: {
    forumId: {
      type: String,
      required: true
    }
  },
  mixins: [asyncDataStatus],
  computed: {
    forum () {
      return this.$store.state.forums.items.find(forum => forum.id === this.forumId)
    }
  },
  data () {
    return {
      formIsDirty: false
    }
  },
  methods: {
    ...mapActions('forums', ['fetchForum']),
    ...mapActions('threads', ['createThread']),
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
  async created () {
    await this.fetchForum({ id: this.forumId })
    this.asyncDataStatus_fetched()
  },
  beforeRouteLeave () {
    if (this.formIsDirty) {
      const confirmed = window.confirm('Are you sure you want to leave? Unsaved changes will be lost!')
      if (!confirmed) return false
    }
  }
}
</script>

<style scoped>

</style>
