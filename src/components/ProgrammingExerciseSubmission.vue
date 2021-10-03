<template>
  <div
    class="p-4 my-4 transition-shadow duration-150 border rounded-lg hover:shadow-lg first:mt-0"
  >
    <div class="flex">
      <h1 class="my-auto text-lg">Sottomissione {{ index + 1 }}</h1>
      <progress-bar
        class="my-auto ml-auto"
        :max="submission.outcomes.length"
        :value="passedTestCases"
      ></progress-bar>
      <UIButton
        class="ml-4"
        :variant="'negative'"
        :size="'2xs'"
        @click="expanded = !expanded"
        ><i
          class="text-xs fas"
          :class="{ 'fa-chevron-down': !expanded, 'fa-chevron-up': expanded }"
        ></i
      ></UIButton>
    </div>
    <div v-show="expanded" class="mt-8">
      <p class="mb-1 font-medium">Codice</p>
      <div
        class="pb-4 border-b"
        v-highlight
        v-html="highlightCode(wrapInBackTicks(submission.code))"
      ></div>
      <div
        class="py-4 my-4 border-b"
        v-for="(outcome, index) in submission.outcomes"
        :key="'s-' + submission.id + '-o-' + index"
      >
        <div class="flex mb-1 space-x-2">
          <p class="font-medium">Test case {{ index + 1 }}</p>
          <p
            class="font-medium"
            :class="{
              'text-red-800': !outcome.passed,
              'text-green-800': outcome.passed
            }"
          >
            {{ outcome.passed ? 'S' : 'Non s' }}uperato
          </p>
        </div>
        <p v-highlight v-html="codify(outcome.code)"></p>
        <div class="my-2" v-if="!outcome.passed">
          <p class="mb-1 font-medium">Dettagli</p>
          <div
            v-highlight
            v-html="highlightCode(wrapInBackTicks(outcome.details))"
          ></div>
        </div>
      </div>
      <div v-if="submission.error.length > 0" class="mt-4">
        <p class="mb-1 font-medium">
          Si è verificato un errore durante l'esecuzione del tuo codice
        </p>
        <div
          v-highlight
          v-html="highlightCode(wrapInBackTicks(submission.error))"
        ></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseSubmission } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import { highlightCode, codify, wrapInBackTicks } from '@/utils'
import UIButton from '@/components/UIButton.vue'
import ProgressBar from '@/components/ProgressBar.vue'

export default defineComponent({
  name: 'ProgrammingExerciseSubmission',
  components: {
    UIButton,
    ProgressBar
  },
  props: {
    submission: {
      type: Object as PropType<ExerciseSubmission>,
      required: true
    },
    index: {
      type: Number
    }
  },
  data () {
    return {
      expanded: false
    }
  },
  methods: {
    highlightCode,
    codify,
    wrapInBackTicks
  },
  computed: {
    passedTestCases (): number {
      return this.submission.outcomes.filter(o => o.passed).length
    }
  }
})
</script>

<style></style>
