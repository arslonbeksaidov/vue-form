<template>
  <div class="flex-grid justify-center">
    <div class="col-2">

      <form @submit.prevent="signIn" action="" class="card card-form">
        <h1 class="text-center">Login</h1>

        <div class="form-group">
          <label for="email">Email</label>
          <input v-model="form.email" id="email" type="text" class="form-input">
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input v-model="form.password" id="password" type="password" class="form-input">
        </div>

        <div class="push-top">
          <button type="submit" class="btn-blue btn-block">Log in</button>
        </div>

        <div class="form-actions text-right">
          <router-link :to="{name: 'Register' }">Create an account?</router-link>
        </div>
      </form>

      <div class="push-top text-center">
        <button @click="signInWithGoogle" class="btn-red btn-xsmall"><i class="fa fa-google fa-btn"></i>Sign in with Google</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'SignIn',
  data () {
    return {
      form: {
        email: '',
        password: ''
      }
    }
  },
  methods: {
    ...mapActions('auth', ['signInWithEmailAndPassword']),
    async signIn () {
      try {
        await this.signInWithEmailAndPassword({ ...this.form })
        this.successRedirect()
      } catch (error) {
        alert(error.message)
      }
    },
    async signInWithGoogle () {
      await this.$store.dispatch('auth/signInWithGmail')
      this.successRedirect()
    },
    successRedirect () {
      const redirectTo = this.$route.query.redirectTo || { name: 'Home' }
      this.$router.push(redirectTo)
    }
  },
  created () {
    this.$emit('ready')
  }
}
</script>

<style scoped>

</style>
