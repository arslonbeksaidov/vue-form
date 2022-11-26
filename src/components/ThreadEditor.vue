<template>
  <form @submit.prevent="save">
    <div class="form-group">
      <label for="thread_title">Title:</label>
      <input v-model="forum.title" type="text" id="thread_title" class="form-input">
    </div>

    <div class="form-group">
      <label for="thread_content">Content:</label>
      <textarea v-model="forum.text" id="thread_content" class="form-input" rows="8" cols="140"></textarea>
    </div>

    <div class="btn-group">
      <button @click.prevent="$emit('cancel')" class="btn btn-ghost">Cancel</button>
      <button class="btn btn-blue" type="submit">
        {{existing ? 'Edit': 'Publish' }}
      </button>
    </div>
  </form>
</template>

<script>
export default {
  name: 'ThreadEditor',
  props: {
    title: { type: String, default: '' },
    text: { type: String, default: '' }
  },
  data () {
    return {
      forum: {
        title: this.title,
        text: this.text
      }
    }
  },
  computed: {
    existing () {
      return !!this.title
    }
  },
  methods: {
    save () {
      this.$emit('save', { ...this.forum })
    }
  }
}
</script>

<style scoped>

</style>
