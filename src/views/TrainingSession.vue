<template>
  <div class="mx-6">
    <h1>Esercitazione</h1>
    <TrainingTemplateSelector
      v-if="showTemplateSelection"
      :courseId="$route.params.courseId"
      @setTemplate="templateId = $event"
    ></TrainingTemplateSelector>
    <div class="my-4" v-for="question in questions" :key="'q-' + question.id">
      <div v-html="question.text"></div>
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

export default defineComponent({
  name: 'TrainingSession',
  components: { TrainingTemplateSelector, UIButton },
  data () {
    return {
      session: {} as TrainingSession,
      answers: {} as { [key: string]: string | null },
      templateId: null,
      showTemplateSelection: false
    }
  },
  async created () {
    await this.getOrCreateSession()
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
      getCurrentTrainingSession(courseId, this.templateId)
        .then(response => {
          this.session = response
        })
        .catch(error => {
          if (error.response.status == 400) {
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
