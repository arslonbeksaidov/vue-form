<template>
 <h1 class="push-top">Welcome to the form list</h1>
  <CategoryList :categories="categories"/>
</template>

<script>
import CategoryList from '@/components/CategoryList'
export default {
  name: 'PageHome',
  components: {
    CategoryList
  },
  computed: {
    categories () {
      return this.$store.state.categories
    }
  },
  async beforeCreate () {
    const categories = await this.$store.dispatch('fetchAllCategories')
    // flat [[1,2,3,4],[22,33,44,55],[5,6,7,8,9]] ni [1,2,3,4,22,33,44,55,5,6,7,8,9] ga o'tkazib beradi.
    const forumId = categories.map(category => category.forums).flat() // bu yerda map bitta listni ichida ikkita list qaytaradi
    this.$store.dispatch('fetchForums', { ids: forumId })
    console.log('before create', this.categories)
  },
  created () {
    console.log('created', this.categories)
  },
  beforeMount () {
    console.log('beforeMount', this.categories)
  },
  mounted () {
    console.log('mounted', this.categories)
  },
  beforeUnmount () {
    console.log('before unmount', this.categories)
  }
}
</script>

<style scoped>

</style>
