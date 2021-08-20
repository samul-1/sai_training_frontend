<template>
  <div>
    <vue-slider
      :process="false"
      :dotStyle="'border-color:' + processColor"
      :width="'90%'"
      :height="8"
      v-if="!readOnly"
      v-model="difficultyData"
      :v-data="difficultiesKeys"
      :marks="difficultiesEntries"
      :tooltip="'none'"
    ></vue-slider>
    <p
      v-else
      class="my-auto font-semibold small-caps"
      :class="{
        'text-green-700':
          difficulty == 'easy_only' || difficulty == 'mostly_easy',
        'text-gray-800': difficulty == 'balanced',
        'text-red-800': difficulty == 'hard_only' || difficulty == 'mostly_hard'
      }"
    >
      {{ difficultyAsCanonString }}
    </p>
  </div>
</template>

<script lang="ts">
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/antd.css'
import { defineComponent, PropType } from '@vue/runtime-core'
import { difficulties } from '@/difficultyProfiles'
export default defineComponent({
  name: 'DifficultyInput',
  props: {
    readOnly: {
      type: Boolean,
      required: true
    },
    difficulty: {
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
    difficultyData (newVal: string) {
      this.$emit('update:modelValue', newVal)
    },
    modelValue (newVal: string) {
      this.difficultyData = newVal
    }
  },
  created () {
    this.difficultyData = this.modelValue as string
  },
  data () {
    return {
      difficultyData: ''
    }
  },
  computed: {
    difficultiesKeys (): string[] {
      return [...Object.keys(difficulties)]
    },
    difficultiesEntries (): Record<string, unknown> {
      return { ...difficulties }
    },
    difficultyAsCanonString (): string {
      const _difficulties = difficulties as Record<string, string>
      return _difficulties[this.difficulty as string]
    },
    processColor () {
      switch (this.difficultyData) {
        case '0':
          return '#10B981'
        case '1':
          return '#34D399'
        case '2':
          return '#60A5FA'
        case '3':
          return '#F87171'
        case '4':
          return '#EF4444'
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
