<template>
  <Skeleton :short="true" v-if="loading"></Skeleton>
  <div v-else class="space-y-2">
    <p>
      <strong class="font-medium">Numero di iscritti:</strong>
      {{ stats.number_enrolled }}
    </p>
    <p>
      <strong class="font-medium">Esercitazioni effettuate:</strong>
      {{ stats.training_sessions }}
    </p>
    <div class="flex flex-col md:flex-row md:space-x-2">
      <p>
        <strong class="font-semibold"
          >Percentuale media di risposte corrette:</strong
        >
        {{ averageCorrectPercentage }}%
      </p>
      <progress-bar
        class="my-2 md:my-auto"
        :max="100"
        :value="averageCorrectPercentage"
      ></progress-bar>
    </div>
  </div>
</template>

<script lang="ts">
import { getCourseStats } from '@/api/courses'
import { CourseStats } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import Skeleton from './Skeleton.vue'
import ProgressBar from '@/components/ProgressBar.vue'

export default defineComponent({
  components: {
    Skeleton,
    ProgressBar
  },
  name: 'CourseStats',
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  async created () {
    this.loading = true
    this.stats = await getCourseStats(this.courseId)
    this.loading = false
  },
  data () {
    return {
      stats: {} as CourseStats,
      loading: false
    }
  },
  computed: {
    averageCorrectPercentage (): number {
      return this.stats.average_correct_percentage * 100
    }
  }
})
</script>

<style></style>
