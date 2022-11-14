<template>
  <div class="col-full">
    <form action="" @submit.prevent="save">
      <div class="form-group">
          <textarea v-model="text" name="" id="" cols="30" rows="10" class="form-input">
          </textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">
          Submit post
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import sourceData from '@/data.json'

export default {
  name: 'PostEditor',
  data () {
    return {
      threads: sourceData.threads,
      posts: sourceData.posts,
      users: sourceData.users,
      text: ''
    }
  },
  methods: {
    save () {
      const postId = 'post_tread' + Math.random()
      const post = {
        id: postId,
        text: this.text,
        publishedAt: Math.floor(Date.now() / 1000),
        userId: 'Miej9zSGMRZKDvMXzfxjVOyv3RF3'
      }
      this.$emit('save', { post })
      this.text = ''
    }
  }
}
</script>

<style scoped>

</style>
