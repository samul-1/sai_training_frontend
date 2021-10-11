<template>
  <div>
    <vue-slider
      :process="false"
      :dotStyle="'border-color:' + processColor"
      :width="'90%'"
      :height="8"
      v-if="!readOnly"
      v-model="profileData"
      :v-data="profilesKeys"
      :marks="profilesEntries"
      :tooltip="'none'"
    ></vue-slider>
    <p
      v-else
      class="my-auto small-caps"
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
      type: String as PropType<string>
      //required: true
    },
    modelValue: {
      type: String as PropType<string>
      //required: true
    }
  },
  components: {
    VueSlider
  },
  watch: {
    profileData (newVal: string) {
      this.$emit('update:modelValue', newVal)
    },
    modelValue (newVal: string) {
      this.profileData = newVal
    }
  },
  created () {
    this.profileData = this.modelValue as string
  },
  data () {
    return {
      profileData: ''
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
      return _profiles[this.profile as string]
    },
    processColor () {
      switch (this.profileData) {
        case 'easy_only':
          return '#10B981'
        case 'mostly_easy':
          return '#34D399'
        case 'balanced':
          return '#60A5FA'
        case 'mostly_hard':
          return '#F87171'
        case 'hard_only':
          return '#EF4444'
      }
      return ''
    }
  }
})
</script>

<style>
@media only screen and (min-device-width: 320px) and (max-device-width: 480px) and (-webkit-min-device-pixel-ratio: 2) {
  .small-caps,
  .vue-slider-mark-label {
    font-size: 10px !important;
  }
}
.small-caps,
.vue-slider-mark-label {
  font-variant-caps: all-small-caps;
  font-variant: small-caps;
}
.vue-slider-mark-label {
  letter-spacing: -0.35px;
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
  border: 3.5px solid #9cd5ff;
  box-sizing: border-box;
  transition: box-shadow 0.3s, border-color 0.3s;
}
.vue-slider-mark-label {
  font-size: 0.85rem;
  margin-top: 3px !important;
}
</style>
