<template>
  <div>
    <h1 class="mx-auto mb-10 text-4xl text-center">
      Esercitazioni Unipi
    </h1>
    <div
      class="w-full px-12 py-16 mx-2 my-auto text-center border rounded-lg shadow-xl md:px-20 md:mx-auto md:w-2/3 border-gray-150"
    >
      <p class="mb-3">
        Effettua l'accesso con il tuo indirizzo email
        <strong>@studenti.unipi.it</strong>.
      </p>
      <p class="mb-3">
        <i class="mr-1 text-sm text-red-700 fas fa-exclamation-circle"></i>
        <span class="font-semibold text-red-700">Attenzione:</span> i cookie
        devono essere abilitati per effettuare il login, e non si deve essere in
        modalità incognito.
      </p>
      <div class="mb-4">
        <span class="mr-3 font-medium">Browser supportati:</span>
        <img
          class="inline-block w-5 h-5 my-auto mr-2 drop-shadow"
          src="../assets/chrome.png"
        />
        <img
          class="inline-block w-5 h-5 my-auto drop-shadow"
          src="../assets/firefox.png"
        />
      </div>
      <div class="text-center">
        <UIButton
          @click="handleClickSignIn"
          :variant="'green'"
          :disabled="false"
          :size="'lg'"
        >
          <i class="mr-1 fas fa-lock"></i> Entra
        </UIButton>
      </div>
    </div>

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
  },
  created () {
    this.$store.commit('resetToken')
  }
}
</script>
