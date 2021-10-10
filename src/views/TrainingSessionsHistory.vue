<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al
        corso</UIButton
      ></router-link
    >
  </teleport>
  <h1 class="mb-8 text-4xl">Le tue esercitazioni</h1>
  <p v-if="!loading && sessions.length == 0">
    Non hai ancora effettuato esercitazioni.
    <router-link
      class="text-blue-700 hover:underline"
      :to="`/course/${$route.params.courseId}/train`"
      >Inizia ora a esercitarti!</router-link
    >
  </p>
  <div class="grid grid-cols-1 gap-6 md:grid-cols-3" v-if="loading">
    <div
      v-for="i in [1, 2, 3]"
      :key="'skeleton-' + i"
      class="px-10 py-6 transition-shadow duration-150 border rounded-md hover:shadow-md"
    >
      <Skeleton :short="true"></Skeleton>
    </div>
  </div>

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
import UIButton from '@/components/UIButton.vue'

export default defineComponent({
  name: 'TrainingSessionsHistory',
  components: {
    TrainingSessionResultsPreview,
    Skeleton,
    UIButton
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
