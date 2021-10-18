<template>
  <div
    :class="{
      'bg-white': !preview,
      'shadow-lg max-h-96 overflow-y-auto': preview,
      'bg-red-200 border-red-200':
        preview &&
        (passedTestCases < submission.outcomes.length ||
          submission.error.length > 0),
      'bg-green-100 border-green-100':
        preview &&
        passedTestCases == submission.outcomes.length &&
        submission.error.length == 0
    }"
    class="p-4 my-4 transition-shadow duration-150 border rounded-lg hover:shadow-md first:mt-0"
  >
    <div class="flex">
      <h1 class="my-auto mr-16 text-lg md:mr-0">
        Sottomissione {{ index + 1 }}
      </h1>
      <p class="my-auto ml-auto text-sm text-gray-800" v-if="!preview">
        {{ humanizedTimstamp }}
      </p>
      <p class="my-auto" :class="{ 'ml-auto': preview, 'ml-8': !preview }">
        {{ passedTestCases }}/{{ submission.outcomes.length }}
      </p>
      <progress-bar
        class="my-auto ml-2"
        :max="submission.outcomes.length"
        :value="passedTestCases"
      ></progress-bar>
      <UIButton
        class="my-auto ml-4"
        :variant="'negative'"
        :size="'2xs'"
        @click="expanded = !expanded"
        ><i
          class="text-xs fas"
          :class="{ 'fa-chevron-down': !expanded, 'fa-chevron-up': expanded }"
        ></i
      ></UIButton>
      <UIButton
        v-if="preview"
        class="my-auto ml-1"
        :variant="'negative'"
        :size="'2xs'"
        @click="$emit('hide')"
        ><i class="px-0.5 text-xs fas fa-times"></i
      ></UIButton>
    </div>
    <div v-show="expanded" class="mt-8">
      <div class="mb-7">
        <div class="flex mb-2 space-x-2">
          <p class="my-auto font-medium">Codice</p>
          <UIButton
            @click="showCode = !showCode"
            :variant="'negative'"
            :size="'2xs'"
            >{{ showCode ? 'Nascondi' : 'Mostra' }}</UIButton
          >
        </div>
        <div v-show="showCode" v-highlight v-html="highlightedCode"></div>
      </div>
      <div
        class="border-t pt-7 mb-7"
        v-for="(outcome, index) in submission.outcomes"
        :key="'s-' + submission.id + '-o-' + index"
      >
        <div class="flex mb-1 space-x-2">
          <p class="font-medium">Test case {{ index + 1 }}</p>
          <p
            class="my-auto text-sm"
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
import moment from 'moment'
import 'moment/locale/it'

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
    },
    preview: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      expanded: false,
      showCode: false
    }
  },
  methods: {
    highlightCode,
    codify,
    wrapInBackTicks
  },
  computed: {
    highlightedCode (): string {
      return this.highlightCode(this.wrapInBackTicks(this.submission.code))
    },
    passedTestCases (): number {
      return this.submission.outcomes.filter(o => o.passed).length
    },
    humanizedTimstamp (): string {
      moment().locale('it')
      return (
        moment(this.submission.timestamp)
          //.calendar()
          .format('DD MMMM YYYY, HH:mm')
      )
    }
  }
})
</script>

<style></style>
