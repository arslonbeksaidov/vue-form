<template>
 <h1>Welcome to the form list</h1>
  <CategoryList :categories="categories"/>
</template>

<script>
import sourceData from '@/data.json'
import CategoryList from '@/components/CategoryList'
export default {
  name: 'PageHome',
  components: {
    CategoryList
  },
  data () {
    return {
      categories: sourceData.categories
    }
  }
}
</script>

<style scoped>

</style>
