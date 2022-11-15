<template>
  <div class="col-full">
    <div class="forum-list">
      <h2 class="list-title">
        <a href="category.html">Feedback &amp; Information</a>
      </h2>
      <div class="forum-listing" v-for="form in forms" :key="form.id">
        <div class="forum-details">
          <router-link :to="{ name: 'Form', params: { id: form.id } }" class="text-xlarge">{{form.name}}</router-link>
          <p>{{ form.description }}</p>
        </div>

        <div class="threads-count">
          <p><span class="count">{{form.threads?.length}}</span> {{threadNumberWord(form)}}</p>
        </div>

        <div class="last-thread"></div>
      </div>

    </div>
  </div>
</template>

<script>
export default {
  name: 'FormList',
  props: {
    forms: {
      required: true,
      type: Array
    }
  },
  methods: {
    threadNumberWord (form) {
      if (form.threads?.length) {
        return form.threads.length > 1 ? 'threads' : 'thread'
      }
      return 'not thread'
    }
  }

}
</script>

<style scoped>

</style>
