<template>
  <div class="h-4 rounded-md bg-gradient-to-tl from-gray-100 to-gray-200">
    <div
      class="h-4 rounded-md"
      :class="{
        'bg-red-400': widthAsPercentage < 45,
        'bg-yellow-400': widthAsPercentage >= 45 && widthAsPercentage <= 50,
        'bg-green-400': widthAsPercentage > 50
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
    },
    fullWidth: {
      type: Boolean,
      default: false
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
