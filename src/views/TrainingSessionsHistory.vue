<template>
  <h1 class="mb-4 text-3xl">Le tue esercitazioni</h1>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
    <TrainingSessionResultsPreview
      v-for="session in sessions"
      :key="'session-' + session.id"
      :session="session"
    ></TrainingSessionResultsPreview>
  </div>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import TrainingSessionResultsPreview from '@/components/TrainingSessionResultsPreview.vue'
import { TrainingSessionResults } from '@/interfaces'
import { getTrainingSessions } from '@/api/trainingSessions'

export default defineComponent({
  name: 'TrainingSessionsHistory',
  components: {
    TrainingSessionResultsPreview
  },
  async created () {
    const courseId = this.$route.params.courseId as string
    this.sessions = await getTrainingSessions(courseId)
  },
  data () {
    return {
      sessions: [] as TrainingSessionResults[]
    }
  }
})
</script>

<style></style>
