<template>
  <h1>{{category.name}}</h1>
<FormList
  :title="category.name"
  :forms="getFormsForCategory()"
/>
</template>

<script>
import FormList from '@/components/FormList'

export default {
  name: 'CategoryPage',
  props: {
    id: {
      required: true,
      type: String
    }
  },
  components: {
    FormList
  },
  computed: {
    category () {
      return this.$store.state.categories.find(category => category.id === this.id)
    }
  },
  methods: {
    getFormsForCategory () {
      return this.$store.state.forums.filter(forum => forum.categoryId === this.id)
    }
  }
}
</script>

<style scoped>

</style>
