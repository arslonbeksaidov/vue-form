<template>
  <h1>{{category.name}}</h1>
<FormList
  :title="category.name"
  :forms="getFormsForCategory()"
/>
</template>

<script>
import FormList from '@/components/FormList'
import sourceData from '@/data.json'

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
      return sourceData.categories.find(category => category.id === this.id)
    }
  },
  methods: {
    getFormsForCategory () {
      return sourceData.forums.filter(forum => forum.categoryId === this.id)
    }
  }
}
</script>

<style scoped>

</style>
