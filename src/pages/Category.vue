<template>
  <h1>{{category.name}}</h1>
<FormList
  :title="category.name"
  :forms="getFormsForCategory()"
/>
</template>

<script>
import FormList from '@/components/FormList'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
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
      return findById(this.$store.state.categories, this.id) || {}
    }
  },
  methods: {
    ...mapActions(['fetchCategory', 'fetchForums']),
    getFormsForCategory () {
      return this.$store.state.forums.filter(forum => forum.categoryId === this.id)
    }
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    this.fetchForums({ ids: category.forums })
  }
}
</script>

<style scoped>

</style>
