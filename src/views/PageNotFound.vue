<template>
  <div
    class="relative mx-auto text-center transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
  >
    <h1 style="letter-spacing: -8px" class="mb-4 text-9xl">
      4
      <div
        class="inline-block transition-all duration-500"
        :class="{ 'animate-spin': spin }"
      >
        0
      </div>
      4
    </h1>
    <h2 class="text-4xl">Pagina non trovata.</h2>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
// import axios from 'axios'

export default defineComponent({
  name: 'PageNotFound',
  created () {
    setTimeout(() => {
      this.spin = true
      setTimeout(() => {
        this.spin = false
      }, 1000)
    }, 300)

    // let Sentry catch this
    throw new Error(
      `404 on ${this.$route.fullPath} by ${
        this.$store.getters.isAuthenticated
          ? this.$store.state.user.email
          : 'Anonymous'
      }`
    )

    // axios
    //   .post('/frontend_errors/', {
    //     additional_info: `404 on ${window.location}`
    //   })
    //   .then(response => {
    //     console.log(response)
    //   })
    //   .catch(error => {
    //     console.log(error)
    //   })
  },
  data () {
    return {
      spin: false
    }
  }
})
</script>

<style></style>
