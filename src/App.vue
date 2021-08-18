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
      <transition name="fade">
        <div
          class="fixed px-20 py-4 transform -translate-x-1/2 rounded-md shadow-xl left-1/2 top-20"
          :class="{
            'bg-green-400 text-green-900': $store.state.smallMsg.severity == 1,
            'bg-red-400 text-red-900': $store.state.smallMsg.severity == 2
          }"
          v-if="$store.state.smallMsg"
          v-html="$store.state.smallMsg.msg"
        ></div>
      </transition>
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
<script>
import axios from 'axios'
export default {
  name: 'App',
  beforeCreate () {
    this.$store.commit('initStore')
  },
  data () {
    return {}
  }
}
</script>
