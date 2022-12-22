<template>
  <div class="container" v-if="asyncDataStatus_ready">
    <h1 class="push-top">Welcome to the form list</h1>
    <CategoryList :categories="categories"/>
  </div>
</template>

<script>
import CategoryList from '@/components/CategoryList'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
export default {
  name: 'PageHome',
  components: {
    CategoryList
  },
  mixins: [asyncDataStatus],
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
    await this.getForums({ ids: forumId })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
