<template>
  <div v-if="asyncDataStatus_ready" class="col-large push-top"
  >
    <h1>{{ thread.title }}
      <router-link
        v-if="thread.userId === authUser?.id"
        :to="{ name: 'ThreadEdit', id: this.id }">
        <button class="btn btn-green btn-small">
          Edit Thread
        </button>
      </router-link>
    </h1>
    <p>
      By <a href="#">{{ thread.author?.name }}</a>,
      <AppDate :timestamp="thread.publishedAt"/>
      <span style="float: right;margin-top: 2px" class="hide-mobile text-faded text-small">
        {{ thread.repliesCount }} replied by {{ thread.contributorsCount }} contributors
      </span>
    </p>
    <PostList :posts="threadPosts"/>
    <PostEditor v-if="authUser" @save="addPost"/>
    <div v-else class="text-center" style="margin-bottom: 50px;">
      <router-link :to="{name: 'SignIn', query: { redirectTo: $route.path }}">Sign In</router-link>
        or
        <router-link :to="{name:'Register', query: { redirectTo: $route.path }}"> Register </router-link>
        to reply.
    </div>
  </div>
</template>

<script>
import PostList from '@/components/PostList'
import PostEditor from '@/components/PostEditor'
import { mapActions, mapGetters } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    PostList,
    PostEditor
  },
  mixins: [asyncDataStatus],
  computed: {
    ...mapGetters(['authUser']),
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
    ...mapActions(['createPost', 'fetchThread', 'fetchUser', 'fetchPosts', 'fetchUsers']),
    addPost (eventData) {
      const post = {
        ...eventData.post,
        threadId: this.id
      }
      this.createPost(post)
    }
  },
  async created () {
    // fetch the thread
    const thread = await this.fetchThread({ id: this.id })

    // fetch posts
    const posts = await this.fetchPosts({ ids: thread.posts })
    // fetch associated with posts
    const users = posts.map(post => post.userId).concat(thread.userId)
    await this.fetchUsers({ ids: users })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
