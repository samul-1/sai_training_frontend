<template>
  <div class="relative transform -translate-y-1/2 top-1/2">
    <h1 class="mx-auto mb-10 text-4xl text-center">
      Esercitazioni Unipi
    </h1>
    <button @click="printDebug()">debug</button>
    <button @click="testGetUser()">test get user</button>
    <div
      class="w-full px-12 py-12 mx-2 my-auto text-center border shadow-xl rounded-xl md:px-20 md:mx-auto md:w-2/3 border-gray-150"
    >
      <h1 class="mx-auto mb-4 text-2xl text-center">
        Login {{ $route.params.role == 'teacher' ? 'docente' : 'studente' }}
      </h1>
      <p class="mb-3">
        Effettua l'accesso con il tuo indirizzo email
        <strong
          >@{{
            $route.params.role == 'teacher' ? '' : 'studenti.'
          }}unipi.it</strong
        >.
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
      <div class="mt-6 text-center">
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
  </div>
</template>

<script>
/* eslint-disable */
import UIButton from '@/components/UIButton.vue'
import { inject, toRefs } from 'vue'
import { getMainView } from '@/router'
export default {
  name: 'Login',
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
        const token = googleUser.getAuthResponse().access_token
        console.log('token', token)

        console.log('calling converToken')
        await this.$store.dispatch('convertToken', token)

        console.log('calling getUserData')
        await this.$store.dispatch('getUserData')

        console.log('pushing to main view')
        this.$router.push(getMainView())
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
    },
    printDebug () {
      console.log('DEBUG INFO')
      console.log(
        "axios.defaults.headers.common['Authorization']",
        axios.defaults.headers.common['Authorization']
      )
    },
    async testGetUser () {
      console.log('calling getUserData')
      await this.$store.dispatch('getUserData')

      console.log('pushing to main view')
      this.$router.push(getMainView())
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
    console.log('options', this.$gAuth)
  }
}
</script>
