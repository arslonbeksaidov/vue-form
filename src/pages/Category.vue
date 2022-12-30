<template>
  <div class="container" v-if="asyncDataStatus_ready">
  <h1>{{category.name}}</h1>
<FormList
  :title="category.name"
  :forms="getFormsForCategory()"
/>
  </div>
</template>

<script>
import FormList from '@/components/FormList'
import { findById } from '@/helpers'
import { mapActions } from 'vuex'
import asyncDataStatus from '@/mixins/asyncDataStatus'
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
  mixins: [asyncDataStatus],
  computed: {
    category () {
      return findById(this.$store.state.categories.items, this.id) || {}
    }
  },
  methods: {
    ...mapActions('categories', ['fetchCategory']),
    ...mapActions('forums', ['fetchForums']),
    getFormsForCategory () {
      return this.$store.state.forums.items.filter(forum => forum.categoryId === this.id)
    }
  },
  async created () {
    const category = await this.fetchCategory({ id: this.id })
    await this.fetchForums({ ids: category.forums })
    this.asyncDataStatus_fetched()
  }
}
</script>

<style scoped>

</style>
