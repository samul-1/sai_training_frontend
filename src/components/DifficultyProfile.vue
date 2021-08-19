<template>
  <div>
    <vue-slider
      :process="false"
      :dotStyle="'border-color:' + processColor"
      :width="'90%'"
      :height="8"
      v-if="!readOnly"
      v-model="profile_data"
      :v-data="profilesKeys"
      :marks="profilesEntries"
      :tooltip="'none'"
    ></vue-slider>
    <p
      v-else
      class="my-auto font-semibold small-caps"
      :class="{
        'text-green-700': profile == 'easy_only' || profile == 'mostly_easy',
        'text-gray-800': profile == 'balanced',
        'text-red-800': profile == 'hard_only' || profile == 'mostly_hard'
      }"
    >
      {{ profileAsCanonString }}
    </p>
  </div>
</template>

<script lang="ts">
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { defineComponent, PropType } from '@vue/runtime-core'
import { profiles, abbreviatedProfiles } from '@/difficultyProfiles'
export default defineComponent({
  name: 'DifficultyProfile',
  props: {
    readOnly: {
      type: Boolean,
      required: true
    },
    profile: {
      type: String as PropType<string>,
      required: true
    }
  },
  components: {
    VueSlider
  },
  created () {
    this.profile_data = this.profile
  },
  data () {
    return {
      profile_data: ''
    }
  },
  computed: {
    profilesKeys (): string[] {
      return [...Object.keys(profiles)]
    },
    profilesEntries (): Record<string, unknown> {
      return { ...abbreviatedProfiles }
    },
    profileAsCanonString (): string {
      const _profiles = profiles as Record<string, string>
      return _profiles[this.profile]
    },
    processColor () {
      switch (this.profile_data) {
        case 'easy_only':
          return '#00ce44'
        case 'mostly_easy':
          return '#009322'
        case 'balanced':
          return '#6068ff'
        case 'mostly_hard':
          return '#f96363'
        case 'hard_only':
          return '#ed4242'
      }
      return ''
    }
  }
})
</script>

<style>
.small-caps,
.vue-slider-mark-label {
  font-variant-caps: all-small-caps;
  font-variant: small-caps;
}
.vue-slider-mark-label-active: {
  font-weight: bold;
}
/* .vue-slider-process {
  background-color: brown;
} */
/* .vue-slider-process:hover {
  background-color: red;
} */
.vue-slider-dot-handle {
  cursor: pointer;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #fff;
  border: 2px solid #9cd5ff;
  box-sizing: border-box;
  transition: box-shadow 0.3s, border-color 0.3s;
}
.vue-slider-mark-label {
  font-size: 0.85rem;
  margin-top: 3px !important;
}
</style>
