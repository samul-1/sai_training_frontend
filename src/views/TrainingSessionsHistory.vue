<template>
  <h1 class="mb-4 text-3xl">Le tue esercitazioni</h1>
  <Skeleton v-if="loading"></Skeleton>
  <p v-if="!loading && sessions.length == 0">
    Non hai ancora effettuato esercitazioni.
    <router-link
      class="text-blue-700 hover:underline"
      :to="`/course/${$route.params.courseId}/train`"
      >Inizia ora a esercitarti!</router-link
    >
  </p>

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
import Skeleton from '@/components/Skeleton.vue'

export default defineComponent({
  name: 'TrainingSessionsHistory',
  components: {
    TrainingSessionResultsPreview,
    Skeleton
  },
  async created () {
    const courseId = this.$route.params.courseId as string
    this.loading = true
    this.sessions = await getTrainingSessions(courseId)
    this.loading = false
  },
  data () {
    return {
      sessions: [] as TrainingSessionResults[],
      loading: false
    }
  }
})
</script>

<style></style>
