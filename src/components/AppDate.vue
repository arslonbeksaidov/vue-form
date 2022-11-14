<template>
  <span :title="humanFriendlyDate()">
    {{diffForHumans()}}
  </span>
</template>

<script>
import relativeTime from 'dayjs/plugin/relativeTime'
import localizedDate from 'dayjs/plugin/localizedFormat'
import dayjs from 'dayjs'
dayjs.extend(relativeTime)
dayjs.extend(localizedDate)
export default {
  props: {
    timestamp: {
      required: true,
      type: Number
    }
  },
  name: 'AppDate',
  methods: {
    diffForHumans () {
      return dayjs.unix(this.timestamp).fromNow()
    },
    humanFriendlyDate () {
      return dayjs.unix(this.timestamp).format('llll')
    }
  }
}
</script>

<style scoped>

</style>
