<template>
 <h1>Welcome to the form list</h1>
  <FormList :forms="forms"/>
</template>

<script>
import sourceData from '@/data.json'
import FormList from '@/components/FormList'
export default {
  name: 'PageHome',
  components: {
    FormList
  },
  data () {
    return {
      forms: sourceData.forums
    }
  }
}
</script>

<style scoped>

</style>
