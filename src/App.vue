<template>
  <div id="app" ref="app" class="flex flex-col h-screen">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.15.2/css/all.css"
      integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu"
      crossorigin="anonymous"
    />
    <nav class="flex w-full px-2 py-2 text-white bg-gray-900 md:px-6">
      <img class="w-24 md:w-32" src="./assets/unipi-logo.svg" />
      <div class="flex my-auto ml-auto">
        <div class="hidden mr-5 md:flex" id="nav-buttons">
          <UIButton
            v-if="false && $route.path != '/student' && $route.path != '/login'"
            @click="$router.go(-1)"
            :variant="'transparent'"
            :size="'xs'"
            class="hidden mr-5 md:inline"
            ><i class="mr-1 text-xs fas fa-chevron-left"></i>Indietro</UIButton
          >
        </div>
        <div class="my-auto" v-if="$store.getters.isAuthenticated">
          <span class="text-sm md:text-md"
            ><i class="mr-2 far fa-user"></i>{{ $store.state.user.email }}</span
          >
          <UIButton
            :size="'3xs'"
            :variant="'transparent'"
            class="ml-2"
            @click="logOut()"
            ><i class="fas fa-sign-out-alt"></i
          ></UIButton>
          <!-- <router-link v-if="$store.state.user.is_teacher" to="/dashboard"
            ><span><i class="ml-6 mr-2 text-lg fas fa-home"></i></span
          ></router-link> -->
        </div>
      </div>
    </nav>

    <transition name="fade">
      <Notification
        :notification="$store.state.notification"
        v-if="$store.state.notification.message"
      ></Notification
    ></transition>

    <main class="flex-grow mx-4 my-6 main-view md:mx-10">
      <router-view />
    </main>
    <footer
      class="flex w-full px-6 py-3 mt-auto text-sm text-white bg-gray-900"
    >
      <p>
        Crafted with
        <img
          alt="love"
          class="inline-block mb-0.5"
          style="width: 0.95rem; margin-left: 1px; margin-right: 1px"
          src="./assets/heart.png"
        />
        by
        <a
          target="_blank"
          class="font-medium text-blue-300 hover:underline"
          href="http://bsamu.it"
          >Samuele Bonini</a
        >
      </p>
      <p class="ml-auto cursor-pointer" @click="showReportForm = true">
        <i
          class="text-red-500 opacity-70 mr-0.5 fas fa-exclamation-triangle"
        ></i>
        <span class="hidden ml-1 animated-underline md:inline"
          >Segnala malfunzionamento</span
        >
      </p>
    </footer>
    <modal
      v-if="showReportForm"
      :dismissible="true"
      :disableOk="reportText.length == 0"
      :noText="'Annulla'"
      :yesText="'Invia'"
      :title="'Segnala malfunzionamento'"
      @no="showReportForm = false"
      @yes="_createTicket()"
      ><template v-slot:body>
        <p class="mb-2">
          Includi qualsiasi dettaglio rilevante nella tua segnalazione. Se
          necessario, verrai ricontattato attraverso la piattaforma o via email.
        </p>
        <textarea
          rows="10"
          class="w-full p-3 border rounded-lg"
          v-model="reportText"
          placeholder="Cosa non va?"
        ></textarea>
      </template>
    </modal>
  </div>
</template>
<script lang="ts">
import 'vue-code-highlight/themes/duotone-sea.css'
import Notification from '@/components/Notification.vue'
import UIButton from '@/components/UIButton.vue'
import { defineComponent } from '@vue/runtime-core'
import { createTicket } from './api/users'
import Modal from './components/Modal.vue'
export default defineComponent({
  name: 'App',
  beforeCreate (): void {
    this.$store.commit('initStore')
  },
  components: {
    Notification,
    UIButton,
    Modal
  },
  data () {
    return {
      showReportForm: false,
      reportText: ''
    }
  },
  methods: {
    logOut () {
      this.$store.commit('resetToken')
      this.$router.push('/login')
    },
    async _createTicket () {
      const reportData = {
        path: this.$route.fullPath,
        browser: this.getBrowser()
      }
      try {
        await createTicket(this.reportText, reportData)
        this.$store.commit('pushNotification', {
          message: 'Grazie per la segnalazione.',
          autoHide: 1500,
          severity: 1
        })
        this.reportText = ''
      } finally {
        this.showReportForm = false
      }
    },
    getBrowser (): string {
      var ua = navigator.userAgent,
        tem,
        M =
          ua.match(
            /(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i
          ) || []
      if (/trident/i.test(M[1])) {
        tem = /\brv[ :]+(\d+)/g.exec(ua) || []
        return `IE v. ${tem[1] || ''}`
      }
      if (M[1] === 'Chrome') {
        tem = ua.match(/\bOPR|Edge\/(\d+)/)
        if (tem != null) {
          return `Opera v. ${tem[1] || ''}`
        }
      }
      M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?']
      if ((tem = ua.match(/version\/(\d+)/i)) != null) {
        M.splice(1, 1, tem[1])
      }
      return M[0] + ' v. ' + M[1]
    }
  }
})
</script>

<style>
.main-view {
  height: auto !important;
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0.9);
    opacity: 0;
  }
  50% {
    transform: scale(1.03);
    opacity: 0.9;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.animated-underline {
  text-underline-offset: 1.5px;
  text-decoration-color: rgba(239, 68, 68, 0.3) !important;
  text-decoration: underline;
  transition: all;
  transition-duration: 200ms;
}

.animated-underline:hover {
  text-decoration-color: rgba(239, 68, 68, 0.7) !important;
}

.token.property,
.token.function {
  color: #a0b4ff !important;
}
</style>
