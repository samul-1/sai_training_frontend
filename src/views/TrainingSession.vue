<template>
  <h1 v-if="!showTemplateSelection" class="mb-4 text-3xl">Esercitazione</h1>
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
      class="my-8"
      v-for="(question, index) in questions"
      :key="'q-' + question.id"
    >
      <h5 class="text-lg font-medium">Domanda {{ index + 1 }}</h5>
      <div class="mb-4" v-html="question.text"></div>
      <div
        v-for="choice in question.choices"
        :key="'q-' + question.id + '-c-' + choice.id"
      >
        <input
          type="radio"
          :value="choice.id"
          class="mr-2"
          v-model="answers[question.id]"
          :id="'q-' + question.id + '-c-' + choice.id"
        />
        <label
          :for="'q-' + question.id + '-c-' + choice.id"
          v-html="choice.text"
        ></label>
      </div>
    </div>
    <UIButton @click="turnIn()" :variant="'green'">Consegna</UIButton>
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

export default defineComponent({
  name: 'TrainingSession',
  components: { TrainingTemplateSelector, UIButton, Skeleton },
  data () {
    return {
      session: {} as TrainingSession,
      answers: {} as { [key: string]: string | null },
      templateId: null,
      showTemplateSelection: false,
      loading: false
    }
  },
  async created () {
    this.loading = true
    await this.getOrCreateSession()
    console.log('false')
    this.loading = false
  },
  watch: {
    async templateId (newVal) {
      if (newVal) {
        this.showTemplateSelection = false
        await this.getOrCreateSession()
      }
    }
  },
  methods: {
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
      const courseId = this.$route.params.courseId as string
      const response = await turnInTrainingSession(courseId, this.answers)
      console.log(response)
      this.$router.push(`/course/${courseId}/sessions/${response.id}`)
    }
  },
  computed: {
    questions (): Question[] {
      return this.session.questions
    }
  }
})
</script>

<style></style>
