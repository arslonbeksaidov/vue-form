<template>
  <div class="post-list">
    <div v-for="post in posts"
         :key="post.id"
         class="post"
    >
      <div v-if="userById(post.userId)" class="user-info">
        <a href="#" class="user-name">{{userById(post.userId).name}}</a>

        <a href="#">
          <img class="avatar-large" :src="userById(post.userId).avatar" alt="">
        </a>

        <p class="desktop-only text-small">{{ userById(post.userId).postsCount }} posts</p>
        <p class="desktop-only text-small">{{ userById(post.userId).threadsCount }} threads</p>

      </div>

      <div class="post-content">
        <div class="col-full">
          <PostEditor v-if="editing === post.id" :post="post"></PostEditor>
          <p v-else>
            {{post.text}}
          </p>
        </div>
        <a
          @click.prevent="toggleEditMode(post.id)"
          href="#"
          style="margin-left: auto;"
          class="link-unstyled"
          title="Make a change">
          <f-a-i icon="pencil"/>
          <i class="fa fa-pencil"></i>
        </a>
      </div>
      <div class="post-date text-faded">
        <AppDate :timestamp="post.publishedAt"/>
      </div>
    </div>
  </div>
</template>

<script>
import PostEditor from '@/components/PostEditor'
export default {
  name: 'PostList',
  components: { PostEditor },
  data () {
    return {
      editing: null
    }
  },
  props: {
    posts: {
      required: true,
      type: Array
    }
  },
  computed: {
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    toggleEditMode (postId) {
      this.editing = postId === this.editing ? null : postId
    },
    userById (userId) {
      return this.$store.getters.user(userId)
    }
  }
}
</script>

<style scoped>

</style>
