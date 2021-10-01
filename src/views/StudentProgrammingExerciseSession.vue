<template>
  <div class="flex w-full h-full border rounded-lg shadow-lg">
    <div class="w-1/5 h-full border-r rounded-tl-lg rounded-bl-lg bg-gray-50">
      <div
        class="flex px-4 transition-colors duration-100 border-b cursor-pointer h-14 hover:bg-gray-100 active:bg-gray-200"
        :class="{
          'bg-gray-200 hover:bg-gray-200': currentExerciseId === exercise.id
        }"
        v-for="(exercise, index) in exercises"
        :key="'e-' + exercise.id"
        @click="currentExerciseId = exercise.id"
      >
        <p class="my-auto">Esercizio {{ index + 1 }}</p>
      </div>
    </div>
    <div class="flex flex-col w-4/5 h-full">
      <div class="w-full h-10 bg-gray-800 rounded-tr-lg"></div>
      <div class="p-4">
        <div v-html="currentExercise.text"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getProgrammingExercises } from '@/api/items'
import { ProgrammingExercise } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'StudentProgrammingExerciseSession',
  async created () {
    const courseId = this.$route.params.courseId as string

    this.exercises = await getProgrammingExercises(courseId, null, null, 1)
    this.currentExerciseId = this.exercises[0].id
  },
  data () {
    return {
      exercises: [] as ProgrammingExercise[],
      currentExerciseId: '_'
    }
  },
  computed: {
    currentExercise (): ProgrammingExercise {
      return (
        this.exercises.find(e => e.id === this.currentExerciseId) ??
        ({} as ProgrammingExercise)
      )
    }
  }
})
</script>

<style></style>
