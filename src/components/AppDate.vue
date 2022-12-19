<template>
  <span :title="humanFriendlyDate">
    {{diffForHumans}}
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
      type: [Number, Object]
    }
  },
  name: 'AppDate',
  computed: {
    normalizedTimestamp () {
      return this.timestamp?.seconds || this.timestamp
    },
    diffForHumans () {
      return dayjs.unix(this.normalizedTimestamp).fromNow()
    },
    humanFriendlyDate () {
      return dayjs.unix(this.normalizedTimestamp).format('llll')
    }
  }
}
</script>

<style scoped>

</style>
