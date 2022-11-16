<template>
  <div class="container">
    <div class="col-full push-top">
      <div class="forum-header">
        <div class="forum-details ">
          <h1>{{form.name}}</h1>
          <p class="text-lead">{{form.description}}</p>
        </div>
        <a href="#" class="btn-green btn-small">Start a thread</a>
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
    form () {
      return this.$store.state.forums.find(form => form.id === this.id)
    },
    threads () {
      return this.$store.state.threads.filter(thread => thread.forumId === this.id)
    }
  }
}
</script>

<style scoped>

</style>
