<template>
  <div>
    <!-- <h1>IsInit: {{ Vue3GoogleOauth.isInit }}</h1>
    <h1>IsAuthorized: {{ Vue3GoogleOauth.isAuthorized }}</h1>
    <h2 v-if="user">signed user: {{ user }}</h2> -->
    <UIButton @click="handleClickSignIn">
      <i class="fas mr-1 fa-lock"></i> Entra
    </UIButton>
    <!-- <button @click="handleClickGetAuthCode" :disabled="!Vue3GoogleOauth.isInit">
      get authCode
    </button>
    <button
      @click="handleClickSignOut"
      :disabled="!Vue3GoogleOauth.isAuthorized"
    >
      sign out
    </button>
    <button
      @click="handleClickDisconnect"
      :disabled="!Vue3GoogleOauth.isAuthorized"
    >
      disconnect
    </button> -->
  </div>
</template>

<script>
/* eslint-disable */
import UIButton from '@/components/UIButton.vue'
import { inject, toRefs } from 'vue'
export default {
  name: 'HelloWorld',
  components: {
    UIButton
  },
  data () {
    return {
      user: ''
    }
  },
  methods: {
    async handleClickSignIn () {
      try {
        const googleUser = await this.$gAuth.signIn()
        if (!googleUser) {
          return null
        }
        console.log('googleUser', googleUser)
        this.user = googleUser.getBasicProfile().getEmail()
        console.log('getId', this.user)
        console.log('getBasicProfile', googleUser.getBasicProfile())
        console.log('getAuthResponse', googleUser.getAuthResponse())
        console.log(
          'getAuthResponse',
          this.$gAuth.instance.currentUser.get().getAuthResponse()
        )
        const token = googleUser.getAuthResponse().access_token
        console.log('token', token)
        await this.$store.dispatch('convertToken', token)
        await this.$store.dispatch('getUserData')
      } catch (error) {
        //on fail do something
        console.error(error)
        return null
      }
    },
    async handleClickGetAuthCode () {
      try {
        const authCode = await this.$gAuth.getAuthCode()
        console.log('authCode', authCode)
      } catch (error) {
        //on fail do something
        console.error(error)
        return null
      }
    },
    async handleClickSignOut () {
      try {
        await this.$gAuth.signOut()
        console.log('isAuthorized', this.Vue3GoogleOauth.isAuthorized)
        this.user = ''
      } catch (error) {
        console.error(error)
      }
    },
    handleClickDisconnect () {
      window.location.href = `https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=${window.location.href}`
    }
  },
  setup (props) {
    const { isSignIn } = toRefs(props)
    const Vue3GoogleOauth = inject('Vue3GoogleOauth')
    console.log('google', Vue3GoogleOauth)
    const handleClickLogin = () => {}
    return {
      Vue3GoogleOauth,
      handleClickLogin,
      isSignIn
    }
  }
}
</script>
