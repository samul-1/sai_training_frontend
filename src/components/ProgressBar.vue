<template>
  <div class="w-32 h-4 rounded-lg bg-gradient-to-tl from-gray-100 to-gray-200">
    <div
      class="h-4 rounded-lg"
      :class="{
        'bg-red-500': widthAsPercentage < 45,
        'bg-yellow-400': widthAsPercentage >= 45 && widthAsPercentage <= 50,
        'bg-green-500': widthAsPercentage > 50
      }"
      :style="'width:' + widthAsPercentage + '%;'"
    ></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'ProgressBar',
  props: {
    value: {
      type: Number,
      required: true
    },
    max: {
      type: Number,
      required: true
    }
  },
  computed: {
    widthAsPercentage (): number {
      return (this.value * 100) / this.max
    }
  }
})
</script>

<style></style>
