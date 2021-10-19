<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al
        corso</UIButton
      ></router-link
    >
  </teleport>
  <div class="">
    <h1 class="mb-8 text-4xl">Risultati esercitazione</h1>
    <div class="flex flex-col mx-2 md:mx-0 md:flex-row">
      <p class="mb-2 text-xl md:mb-0">
        <span class="mr-2 font-medium">Risposte corrette:</span>
        <span>{{ results.score }} su {{ multipleChoiceQuestionsAmount }}</span>
      </p>
      <progress-bar
        class="w-full mt-1 mb-4 md:my-auto md:mx-4 md:w-52"
        :value="results.score"
        :max="multipleChoiceQuestionsAmount"
      ></progress-bar>
      <p
        class="mt-2 text-sm md:my-auto md:mx-4 opacity-70"
        v-if="areThereOpenEndedQuestions"
      >
        Non sono conteggiate le domande a risposta aperta
      </p>
      <UIButton
        :variant="'indigo'"
        class=""
        :size="'xs'"
        @click="wrongOnly = !wrongOnly"
        v-if="areThereWrong"
        >Mostra {{ wrongOnly ? 'tutte' : 'solo sbagliate' }}</UIButton
      >
    </div>
    <div v-if="loading">
      <skeleton></skeleton>
      <skeleton></skeleton>
    </div>
    <div
      v-if="areThereHelpTexts"
      class="p-6 pb-5 my-4 border rounded-md shadow-md md:p-8"
    >
      <p class="mb-2">
        <i class="mr-1 text-lg text-red-300 fas fa-exclamation-triangle"></i>
        Hai sbagliato almeno il 50% delle domande nelle seguenti categorie:
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
import Skeleton from '@/components/Skeleton.vue'
import UIButton from './UIButton.vue'
import { Question, TrainingSessionResults } from '@/interfaces'
import ProgressBar from '@/components/ProgressBar.vue'

export default defineComponent({
  name: 'TrainingSessionResults',
  components: {
    FullQuestion,
    UIButton,
    Skeleton,
    ProgressBar
  },
  data () {
    return {
      loading: false,
      results: {
        score: 0,
        questions: [] as Question[],
        help_texts: {} as Record<string, string>
      } as TrainingSessionResults,
      showCorrectAnswers: false,
      wrongOnly: false
    }
  },
  async created () {
    const courseId = this.$route.params.courseId as string
    const sessionId = this.$route.params.sessionId as string
    this.loading = true
    this.results = await getTrainingSessionResults(courseId, sessionId)
    this.loading = false
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
        q =>
          !q.is_open_ended &&
          q.selected_choice !== q.choices.find(c => c.correct)?.id
      )
    },
    areThereWrong (): boolean {
      return (
        this.results.questions.filter(
          q =>
            !q.is_open_ended &&
            q.selected_choice !== q.choices.find(c => c.correct)?.id
        ).length > 0
      )
    },
    areThereHelpTexts (): boolean {
      return (
        Object.keys(this.results.help_texts as Record<string, string>).length >
        0
      )
    },
    multipleChoiceQuestionsAmount (): number {
      return this.results.questions.filter(q => !q.is_open_ended).length
    },
    areThereOpenEndedQuestions (): boolean {
      return this.multipleChoiceQuestionsAmount < this.results.questions.length
    }
  }
})
</script>

<style></style>
