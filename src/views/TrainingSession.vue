<template>
  <TrainingTemplateSelector
    v-if="showTemplateSelection"
    :courseId="$route.params.courseId"
    @setTemplate="templateId = $event"
  ></TrainingTemplateSelector>
  <p v-for="question in session.questions" :key="question.id">
    {{ question.text }}
  </p>
</template>

<script lang="ts">
import { TrainingSession } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { getCurrentTrainingSession } from '@/api/trainingSessions'
import TrainingTemplateSelector from '@/components/TrainingTemplateSelector.vue'

export default defineComponent({
  name: 'TrainingSession',
  components: { TrainingTemplateSelector },
  data () {
    return {
      session: {} as TrainingSession,
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
    }
  }
})
</script>

<style></style>
