<template>
  <div>TrainingSession</div>
</template>

<script lang="ts">
import { TrainingSession } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { getCurrentTrainingSession } from '@/api/trainingSessions'

export default defineComponent({
  name: 'TrainingSession',
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
