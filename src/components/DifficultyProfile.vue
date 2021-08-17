<template>
  <p
    class="my-auto font-semibold small-caps"
    :class="{
      'text-green-700': profile == 'easy_only' || profile == 'mostly_easy',
      'text-gray-800': profile == 'balanced',
      'text-red-800': profile == 'hard_only' || profile == 'mostly_hard'
    }"
  >
    {{ profileAsCanonString }}
  </p>
</template>

<script>
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'DifficultyProfile',
  props: {
    readOnly: {
      type: Boolean,
      required: true
    },
    profile: {
      type: String,
      required: true
    }
  },
  computed: {
    profileAsCanonString () {
      switch (this.profile) {
        case 'easy_only':
          return 'solo facili'
        case 'mostly_easy':
          return 'prevalent. facili'
        case 'balanced':
          return 'diff. bilanciata'
        case 'mostly_hard':
          return 'prevalent. difficili'
        case 'hard_only':
          return 'solo difficili'
      }
      return null
    }
  }
})
</script>

<style>
.small-caps {
  font-variant-caps: all-small-caps;
  font-variant: small-caps;
}
</style>
