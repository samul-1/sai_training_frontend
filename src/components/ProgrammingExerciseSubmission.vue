<template>
  <div class="p-4 my-4 border rounded-lg shadow-md first:mt-0">
    <div class="flex">
      <h1 class="my-auto">Sottomissione {{ index + 1 }}</h1>
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
    <div v-show="expanded" class="mt-4">
      <div v-highlight v-html="highlightCode(wrappedSubmissionCode)"></div>
    </div>
  </div>
</template>

<script lang="ts">
import { ExerciseSubmission } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import { highlightCode } from '@/utils'
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
    highlightCode
  },
  computed: {
    passedTestCases (): number {
      return this.submission.outcomes.filter(o => o.passed).length
    },
    wrappedSubmissionCode (): string {
      return '```\n' + this.submission.code + '\n```'
    }
  }
})
</script>

<style></style>
