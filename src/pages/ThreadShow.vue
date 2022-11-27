<template>
  <div class="col-large push-top"
  >
    <h1>{{thread.title}}
      <router-link :to="{ name: 'ThreadEdit', id: this.id }">
        <button class="btn btn-green btn-small">
          Edit Thread
        </button>
      </router-link>
    </h1>
    <p>
      By <a href="#">{{ thread.author.name }}</a>, <AppDate :timestamp="thread.publishedAt"/>
      <span style="float: right;margin-top: 2px" class="hide-mobile text-faded text-small">
        {{thread.repliesCount}} replied by {{thread.contributorsCount}} contributors
      </span>
    </p>
    <PostList :posts="threadPosts"/>
    <PostEditor @save="addPost"/>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import AppDate from '@/components/AppDate'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    AppDate,
    PostList,
    PostEditor
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    thread () {
      return this.$store.getters.thread(this.id)
    },
    threadPosts () {
      return this.posts.filter(post => post.threadId === this.id)
    }
  },
  methods: {
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.$store.dispatch('createPost', post)
    }
  }
}
</script>

<style scoped>

</style>
