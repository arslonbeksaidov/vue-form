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
import sourceDate from '@/data.json'
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
      return sourceDate.forums.filter(forum => forum.categoryId === category.id)
    }
  }
}
</script>

<style scoped>

</style>
