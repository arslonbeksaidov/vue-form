<template>
  <the-navbar/>
  <div class="container">
    <router-view v-show="showPage" @ready="onPageReady()" :key="$route.path"></router-view>
    <AppSpinner v-show="!showPage" class="push-top"/>
  </div>
</template>

<script>

import TheNavbar from '@/components/TheNavbar'
import { mapActions } from 'vuex'
import AppSpinner from '@/components/AppSpinner'
import NProgress from 'nprogress'
export default {
  name: 'App',
  components: { AppSpinner, TheNavbar },
  data () {
    return {
      showPage: false
    }
  },
  methods: {
    ...mapActions(['fetchAuthUser']),
    onPageReady () {
      this.showPage = true
      NProgress.done()
    }
  },
  created () {
    this.fetchAuthUser()
    NProgress.configure({
      speed: 200,
      showSpinner: false
    })
    this.$router.beforeEach(() => {
      this.showPage = false
      NProgress.start()
    })
  }
}
</script>

<style>
@import "assets/style.css";
@import "~nprogress/nprogress.css";
#npgrogress .bar {
  background: #57AD8D !important;
}
</style>
