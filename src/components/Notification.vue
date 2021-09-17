<template>
  <div
    style="z-index: 999"
    class="fixed w-11/12 px-4 py-4 text-center transform -translate-x-1/2 rounded-md shadow-xl md:w-5/12 md:px-20 left-1/2 top-20"
    :class="{
      'bg-green-300 text-green-900': notification.severity == 1,
      'bg-red-300 text-red-900': notification.severity == 2
    }"
  >
    <div v-html="notification.message"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'Notification',
  props: {
    notification: {
      type: Object
    }
  }
})
</script>

<style></style>
