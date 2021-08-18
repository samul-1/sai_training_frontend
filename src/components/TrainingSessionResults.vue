<template>
  <div>TraininSessionResults</div>
  {{ results.score }}
</template>

<script lang="ts">
import { getTrainingSessionResults } from '@/api/trainingSessions'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'TrainingSessionResults',
  data () {
    return {
      results: {} as unknown
    }
  },
  async created () {
    const courseId = this.$route.params.courseId as string
    const sessionId = this.$route.params.sessionId as string
    this.results = await getTrainingSessionResults(courseId, sessionId)
  }
})
</script>

<style></style>
