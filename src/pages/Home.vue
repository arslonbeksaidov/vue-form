<template>
 <h1 class="push-top">Welcome to the form list</h1>
  <CategoryList :categories="categories"/>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'
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
  methods: {
    // ...mapActions(['fetchAllCategories', 'fetchForums']) or this version usage
    ...mapActions({
      getCats: 'fetchAllCategories',
      getForums: 'fetchForums'
    })
  },
  async created () {
    const categories = await this.getCats()
    // flat [[1,2,3,4],[22,33,44,55],[5,6,7,8,9]] ni [1,2,3,4,22,33,44,55,5,6,7,8,9] ga o'tkazib beradi.
    const forumId = categories.map(category => category.forums).flat() // bu yerda map bitta listni ichida ikkita list qaytaradi
    this.getForums({ ids: forumId })
    console.log('before create', this.categories)
  }
}
</script>

<style scoped>

</style>
