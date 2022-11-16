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
export default {
  name: 'PostEditor',
  data () {
    return {
      text: ''
    }
  },
  computed: {
    threads () {
      return this.$store.state.threads
    },
    posts () {
      return this.$store.state.posts
    },
    users () {
      return this.$store.state.users
    }
  },
  methods: {
    save () {
      const post = {
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
