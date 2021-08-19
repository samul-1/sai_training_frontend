<template>
  <div id="app" ref="app" class="flex flex-col h-screen">
    <link
      rel="stylesheet"
      href="https://use.fontawesome.com/releases/v5.15.2/css/all.css"
      integrity="sha384-vSIIfh2YWi9wW0r9iZe7RJPrKwp6bG+s9QZMoITbCckVJqGCCRhc+ccxNcdpHuYu"
      crossorigin="anonymous"
    />
    <nav class="flex w-full px-6 py-2 text-white bg-gray-900">
      <img class="w-28 md:w-32" src="./assets/unipi-logo.svg" />
      <div class="my-auto ml-auto">
        <UIButton
          v-if="$route.path != '/student' && $route.path != '/login'"
          @click="$router.go(-1)"
          :variant="'transparent'"
          :size="'xs'"
          class="hidden mr-5 md:inline"
          ><i class="mr-1 text-xs fas fa-chevron-left"></i>Indietro</UIButton
        >
        <template v-if="$store.getters.isAuthenticated">
          <span class="text-sm md:text-md"
            ><i class="mr-2 far fa-user"></i>{{ $store.state.user.email }}</span
          >
          <router-link v-if="$store.state.user.is_teacher" to="/dashboard"
            ><span><i class="ml-6 mr-2 text-lg fas fa-home"></i></span
          ></router-link>
        </template>
      </div>
    </nav>

    <transition name="fade">
      <Notification
        :notification="$store.state.notification"
        v-if="$store.state.notification.message"
      ></Notification
    ></transition>

    <main class="my-auto">
      <div
        v-if="$store.state.msg"
        class="py-12 mx-auto text-white bg-gray-900 rounded-lg shadow-md px-36 w-max"
      >
        <h1 class="text-xl text-center" v-html="$store.state.msg"></h1>
      </div>
      <div class="mx-5 my-6 md:mx-10" v-else>
        <router-view />
      </div>
    </main>
    <footer class="flex w-full px-6 py-3 text-sm text-white bg-gray-900">
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
    </footer>
  </div>
</template>
<script lang="ts">
import Notification from '@/components/Notification.vue'
import UIButton from '@/components/UIButton.vue'
import { defineComponent } from '@vue/runtime-core'
export default defineComponent({
  name: 'App',
  beforeCreate (): void {
    this.$store.commit('initStore')
  },
  components: {
    Notification,
    UIButton
  }
})
</script>

<style>
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
</style>
