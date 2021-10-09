<template>
  <div
    class="relative px-2 py-6 my-6 transition-shadow duration-300 border rounded-md md:px-8 group hover:shadow-md"
  >
    <i
      v-if="showIcon"
      class="absolute top-0 right-0 mt-4 mr-4 text-lg transition-opacity duration-300 md:text-2xl fas opacity-40 group-hover:opacity-70 group-hover:shadow-lg"
      :class="{
        'fa-check-circle text-green-600':
          !question.is_open_ended &&
          question.choices.find(c => c.correct)?.id == question.selected_choice,
        'fa-times-circle text-red-600':
          !question.is_open_ended &&
          question.choices.find(c => c.correct)?.id != question.selected_choice,
        'fa-minus-circle text-gray-300': question.is_open_ended
      }"
    ></i>
    <div v-highlight v-html="highlightCode(question.text)"></div>
    <ul class="mt-4">
      <li
        v-for="choice in question.choices"
        :key="'q-' + question.id + '-c-' + choice.id"
        class="px-1 py-0.5 my-1.5 transition-colors duration-700 rounded-md"
        :class="{
          'bg-green-100': choice.correct && showCorrect,
          'bg-red-100 bg-opacity-80': !choice.correct && showCorrect
        }"
      >
        <div class="flex">
          <input
            type="radio"
            class="mb-auto mt-1.5 mr-2 text-red-900 pointer-events-none"
            :checked="choice.id == question.selected_choice"
          /><span v-highlight v-html="highlightCode(choice.text)"></span>
        </div>
      </li>
    </ul>
    <div v-if="question.open_answer_text?.length > 0">
      <p class="mb-1 text-lg font-medium">La tua risposta</p>
      <div class="p-2 whitespace-pre rounded-md bg-blue-50">
        {{ question.open_answer_text }}
      </div>
    </div>
    <div class="mt-4" v-if="question.solution.length > 0">
      <div class="flex space-x-2">
        <p class="mb-1 text-lg font-medium">Soluzione</p>
        <UIButton
          :variant="'negative'"
          :size="'2xs'"
          class="my-auto"
          @click="showSolution = !showSolution"
          >{{ showSolution ? 'Nascondi' : 'Mostra' }} soluzione</UIButton
        >
      </div>
      <div
        class="p-2 mt-2 rounded-md bg-blue-50"
        v-if="showSolution"
        v-html="question.solution"
      ></div>
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
    },
    showIcon: {
      type: Boolean,
      default: true
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
