<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al
        corso</UIButton
      ></router-link
    >
  </teleport>
  <Spinner v-if="loadingResults"></Spinner>
  <h1 v-if="!showTemplateSelection" class="mb-4 text-4xl">Esercitazione</h1>
  <div v-if="loading">
    <Skeleton></Skeleton>
    <Skeleton class="my-2"></Skeleton>
  </div>
  <TrainingTemplateSelector
    v-else-if="showTemplateSelection"
    :courseId="$route.params.courseId"
    @setTemplate="templateId = $event"
  ></TrainingTemplateSelector>
  <div v-else>
    <div
      class="my-10 first:mt-8 last:mb-8"
      v-for="(question, index) in questions"
      :key="'q-' + question.id"
    >
      <h5 class="text-xl">Domanda {{ index + 1 }}</h5>
      <div class="py-2 pl-2 mt-1 border-l-2 border-gray-200 md:pl-4">
        <div
          class="mb-4"
          v-highlight
          v-html="highlightCode(question.text)"
        ></div>
        <div
          v-for="choice in question.choices"
          :key="'q-' + question.id + '-c-' + choice.id"
          class="flex transition-colors duration-200 rounded-lg hover:bg-gray-50"
        >
          <input
            type="radio"
            :value="choice.id"
            class="mt-1.5 mb-auto mr-2"
            v-model="answers[question.id]"
            :id="'q-' + question.id + '-c-' + choice.id"
          />
          <label
            v-highlight
            :for="'q-' + question.id + '-c-' + choice.id"
            class="cursor-pointer"
            v-html="highlightCode(choice.text)"
          ></label>
        </div>
      </div>
    </div>
    <UIButton @click="turnIn()" :variant="'green'" :disabled="loadingResults"
      >Consegna</UIButton
    >
  </div>
</template>

<script lang="ts">
import { Question, TrainingSession } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import {
  getCurrentTrainingSession,
  turnInTrainingSession
} from '@/api/trainingSessions'
import TrainingTemplateSelector from '@/components/TrainingTemplateSelector.vue'
import UIButton from '@/components/UIButton.vue'
import Skeleton from '@/components/Skeleton.vue'
import Spinner from '@/components/Spinner.vue'
import { highlightCode } from '@/utils'

export default defineComponent({
  name: 'TrainingSession',
  components: { TrainingTemplateSelector, UIButton, Skeleton, Spinner },
  data () {
    return {
      session: {} as TrainingSession,
      answers: {} as { [key: string]: string | null },
      templateId: null,
      showTemplateSelection: false,
      loading: false,
      loadingResults: false
    }
  },
  async created () {
    const courseId = this.$route.params.courseId as string

    this.loading = true
    await this.getOrCreateSession()
    this.loading = false

    // restore previously given answers if session was interrupted
    if (localStorage.getItem(`answers_${courseId}`)) {
      if (localStorage.getItem(`sessionId_${courseId}`) == this.session.id) {
        this.answers = JSON.parse(
          localStorage.getItem(`answers_${courseId}`) as string
        )
      } else {
        localStorage.removeItem(`answers_${courseId}`)
      }
    }
    localStorage.setItem(`sessionId_${courseId}`, this.session.id)
  },
  watch: {
    async templateId (newVal) {
      if (newVal) {
        this.loading = true
        this.showTemplateSelection = false
        await this.getOrCreateSession()
        this.loading = false
      }
    },
    answersAsJson (newVal) {
      const courseId = this.$route.params.courseId as string
      localStorage.setItem(`answers_${courseId}`, newVal)
    }
  },
  methods: {
    highlightCode,
    async getOrCreateSession () {
      const courseId = this.$route.params.courseId as string
      return getCurrentTrainingSession(courseId, this.templateId)
        .then(response => {
          this.session = response
        })
        .catch(error => {
          if (error.status == 204) {
            // a new session needs to be created, therefore a template id is required
            this.showTemplateSelection = true
          } else {
            throw error
          }
        })
    },
    async turnIn () {
      this.loadingResults = true
      const courseId = this.$route.params.courseId as string
      const response = await turnInTrainingSession(courseId, this.answers)
      this.loadingResults = false

      localStorage.removeItem(`answers${courseId}`)
      localStorage.removeItem(`sessionId_${courseId}`)
      this.$router.push(`/course/${courseId}/sessions/${response.id}`)
    }
  },
  computed: {
    questions (): Question[] {
      return this.session.questions
    },
    answersAsJson (): string {
      return JSON.stringify(this.answers)
    }
  }
})
</script>

<style></style>
