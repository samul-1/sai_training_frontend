<template>
  <div class="my-6">
    <h1 class="mb-4 text-2xl">Risultati esercitazione</h1>
    <div class="flex flex-col md:flex-row md:space-x-3">
      <p class="my-auto mb-2 md:mb-0">
        <span class="font-medium">Risposte corrette:</span>
        {{ results.score }} su {{ results.questions.length }}
      </p>
      <UIButton
        :variant="'indigo'"
        :size="'xs'"
        @click="wrongOnly = !wrongOnly"
        v-if="areThereWrong"
        >Mostra {{ wrongOnly ? 'tutte' : 'solo sbagliate' }}</UIButton
      >
    </div>
    <div
      v-if="results.help_texts != {}"
      class="p-8 pb-5 my-4 border rounded-xl"
    >
      <p class="mb-2">
        <i class="text-red-700 fas fa-exclamation-triangle"></i> Hai sbagliato
        almeno il 50% delle domande nelle seguenti categorie:
      </p>
      <div
        v-for="(text, topic) in results.help_texts"
        class="my-4"
        :key="'help-text-' + topic"
      >
        <p class="text-lg font-medium">
          <i class="my-auto text-xs md:mr-1 fas fa-caret-right"></i> {{ topic }}
        </p>
        <p>
          <span class="mr-1 font-medium">Suggerimento:</span>
          <span v-html="text"></span>
        </p>
      </div>
    </div>
    <FullQuestion
      v-for="question in filteredQuestions"
      :key="'q-' + question.id"
      :question="question"
      :showCorrect="showCorrectAnswers"
    ></FullQuestion>
    <router-link :to="`/course/${$route.params.courseId}`"
      ><UIButton class="mt-2">Torna al corso</UIButton></router-link
    >
  </div>
</template>

<script lang="ts">
import { getTrainingSessionResults } from '@/api/trainingSessions'
import { defineComponent } from '@vue/runtime-core'
import FullQuestion from '@/components/FullQuestion.vue'
import UIButton from './UIButton.vue'
import { Question, TrainingSessionResults } from '@/interfaces'

export default defineComponent({
  name: 'TrainingSessionResults',
  components: {
    FullQuestion,
    UIButton
  },
  data () {
    return {
      results: {} as TrainingSessionResults,
      showCorrectAnswers: false,
      wrongOnly: false
    }
  },
  async created () {
    const courseId = this.$route.params.courseId as string
    const sessionId = this.$route.params.sessionId as string
    this.results = await getTrainingSessionResults(courseId, sessionId)
    setTimeout(() => {
      this.showCorrectAnswers = true
    }, 500)
  },
  computed: {
    filteredQuestions (): Question[] {
      if (!this.wrongOnly) {
        return this.results.questions
      }
      return this.results.questions.filter(
        q => q.selected_choice !== q.choices.find(c => c.correct)?.id
      )
    },
    areThereWrong (): boolean {
      return (
        this.results.questions.filter(
          q => q.selected_choice !== q.choices.find(c => c.correct)?.id
        ).length > 0
      )
    }
  }
})
</script>

<style></style>
