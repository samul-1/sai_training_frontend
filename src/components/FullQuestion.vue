<template>
  <div
    class="relative px-8 py-6 my-6 transition-shadow duration-300 border rounded-xl group hover:shadow-md"
  >
    <i
      class="absolute top-0 right-0 mt-4 mr-4 text-lg transition-opacity duration-300 md:text-2xl fas opacity-40 group-hover:opacity-70 group-hover:shadow-lg"
      :class="{
        'fa-check-circle text-green-600':
          question.choices.find(c => c.correct)?.id == question.selected_choice,
        'fa-times-circle text-red-600':
          question.choices.find(c => c.correct)?.id != question.selected_choice
      }"
    ></i>
    <div v-highlight v-html="highlightCode(question.text)"></div>
    <ul>
      <li
        v-for="choice in question.choices"
        :key="'q-' + question.id + '-c-' + choice.id"
        class="px-1 py-0.5 my-1.5 transition-colors duration-700 rounded-lg"
        :class="{
          'bg-green-100': choice.correct && showCorrect,
          'bg-red-100': !choice.correct && showCorrect
        }"
      >
        <input
          type="radio"
          class="mr-2 text-red-900 pointer-events-none"
          :checked="choice.id == question.selected_choice"
        /><span v-highlight v-html="highlightCode(choice.text)"></span>
      </li>
    </ul>
    <div class="mt-4" v-if="question.solution.length > 0">
      <UIButton
        :variant="'dark'"
        :size="'xs'"
        @click="showSolution = !showSolution"
        >{{ showSolution ? 'Nascondi' : 'Mostra' }} soluzione</UIButton
      >
      <div class="mt-2" v-if="showSolution" v-html="question.solution"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { Question } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import UIButton from './UIButton.vue'
import { highlightCode } from '@/utils'

export default defineComponent({
  components: { UIButton },
  name: 'FullQuestion',
  props: {
    question: {
      type: Object as PropType<Question>,
      required: true
    },
    showCorrect: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showSolution: false
    }
  },
  methods: {
    highlightCode
  }
})
</script>

<style></style>
