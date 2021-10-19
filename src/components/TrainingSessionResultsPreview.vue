<template>
  <div
    class="px-12 py-4 transition-shadow duration-150 bg-opacity-50 border border-gray-200 rounded-md bg-gray-40 hover:shadow-md"
  >
    <p class="text-center uppercase">
      {{ humanizedTimstamp }}
    </p>
    <div class="flex flex-col items-center mt-2 space-y-2">
      <div class="mb-2 md:mb-0">
        <div class="text-sm font-light text-center text-gray-500">Corrette</div>
        <div class="text-2xl font-medium text-center">
          {{ session.score }} <span class="font-light">su</span>
          {{ multipleChoiceQuestionsAmount }}
        </div>
      </div>
      <progress-bar
        class="w-full"
        :value="session.score"
        :max="multipleChoiceQuestionsAmount"
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
      type: Object as PropType<TrainingSessionResults>,
      required: true
    }
  },
  computed: {
    humanizedTimstamp (): string {
      moment().locale('it')
      return (
        moment(this.session.begin_timestamp)
          //.calendar()
          .format('DD MMMM YYYY')
      )
    },
    multipleChoiceQuestionsAmount (): number {
      // todo get rid of duplicated logic (this function also appears in TrainingSessionResults.vue)
      return this.session.questions.filter(q => !q.is_open_ended).length
    }
  }
})
</script>

<style></style>
