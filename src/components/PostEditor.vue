<template>
  <div class="col-full">
    <form action="" @submit.prevent="save">
      <div class="form-group">
          <textarea v-model="postCopy.text" name="" id="" cols="30" rows="10" class="form-input">
          </textarea>
      </div>
      <div class="form-actions">
        <button class="btn-blue">
          {{post.id ? "Update Post" : "Create Post"}}
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
      postCopy: { ...this.post }
    }
  },
  props: {
    post: {
      type: Object,
      default: () => ({
        text: null
      })
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
      this.$emit('save', { post: this.postCopy })
      this.postCopy.text = ''
    }
  }
}
</script>

<style scoped>

</style>
