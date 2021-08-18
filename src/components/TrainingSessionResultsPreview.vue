<template>
  <div
    class="px-10 py-6 transition-shadow duration-150 border rounded-xl hover:shadow-md"
  >
    <p class="text-center uppercase">
      {{ humanizedTimstamp }}
    </p>
    <div class="flex flex-col mt-6 md:space-x-4 md:flex-row">
      <span class="mb-2 md:mb-0">Corrette: {{ session.score }}</span>
      <progress-bar
        class="my-auto"
        :value="session.score"
        :max="session.questions.length"
      ></progress-bar>
    </div>
    <div class="flex mt-6">
      <router-link
        class="mx-auto"
        :to="`/course/${$route.params.courseId}/sessions/${session.id}`"
        append
        ><UIButton>Dettagli</UIButton></router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import moment from 'moment'
import 'moment/locale/it'
import { TrainingSessionResults } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import ProgressBar from './ProgressBar.vue'
import UIButton from './UIButton.vue'

export default defineComponent({
  components: { UIButton, ProgressBar },
  name: 'TrainingSessionResultsPreview',
  props: {
    session: {
      type: Object as PropType<TrainingSessionResults>
    }
  },
  computed: {
    humanizedTimstamp (): string {
      moment().locale('it')
      return (
        moment(this.session?.begin_timestamp)
          //.calendar()
          .format('DD MMMM YYYY')
      )
    }
  }
})
</script>

<style></style>
