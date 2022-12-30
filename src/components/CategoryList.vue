<template>
<FormList
  v-for="category in categories"
  :key="category.id"
  :forms="getFormsForCategory(category)"
  :title="category.name"
  :category-id="category.id"
/>
</template>

<script>
import FormList from '@/components/FormList'

export default {
  name: 'CategoryList',
  props: {
    categories: {
      required: true,
      type: Array
    }
  },
  components: {
    FormList
  },
  methods: {
    getFormsForCategory (category) {
      return this.$store.state.forums.items.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>

<style scoped>

</style>
