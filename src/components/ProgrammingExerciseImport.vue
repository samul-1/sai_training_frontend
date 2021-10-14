<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course-panel/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al pannello del
        corso</UIButton
      ></router-link
    >
  </teleport>
  <h1 class="mb-8 text-4xl text-center">Importa esercizi JS</h1>
  <div>
    <div class="ml-4">
      <ol class="list-decimal">
        <li :class="{ 'text-green-800': exercises.length }">
          Seleziona un file in formato <strong>JSON</strong> contenente una
          lista di esercizi JS.
          <i class="ml-2 fas fa-check" v-if="exercises.length"></i>
        </li>
        <li :class="{ 'text-green-800': exercises.length && valid }">
          Per ogni esercizio, seleziona un argomento in cui includerla e un
          livello di difficoltà.
          <i class="ml-2 fas fa-check" v-if="exercises.length && valid"></i>
        </li>
        <li>Clicca su <strong>Importa</strong>.</li>
      </ol>
    </div>
    <input
      v-if="!exercises.length"
      type="file"
      @change="processFile"
      class="mt-4 mb-10"
    />
  </div>
  <div
    class="relative grid grid-cols-10 gap-20 my-4 mr-10"
    v-for="(exercise, index) in exercises"
    :key="'q-tmp-' + index"
  >
    <div
      v-if="skippedIndices.includes(index)"
      class="absolute text-gray-900 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      Questo esercizio non verrà importato.
      <span
        @click="skippedIndices.splice(skippedIndices.indexOf(index), 1)"
        class="font-medium text-blue-800 cursor-pointer"
        >Annulla</span
      >
    </div>
    <ProgrammingExerciseEditor
      class="col-span-10"
      v-model="exercises[index]"
      :topicChoices="topics"
      @updateTopics="updateTopics()"
      @delete="skippedIndices.push(index)"
      :class="{
        'opacity-40 pointer-events-none': skippedIndices.includes(index)
      }"
      :showSave="false"
      :startCollapsed="true"
      :exerciseTempKey="index"
    ></ProgrammingExerciseEditor>
  </div>
  <UIButton
    @click="_importexercises()"
    v-if="exercises.length"
    :variant="'green'"
    :disabled="!valid || !exercises.length"
    >Importa</UIButton
  >
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { getTopics } from '@/api/courses'
import { HTMLInputEvent, ProgrammingExercise, Topic } from '@/interfaces'
import ProgrammingExerciseEditor from './ProgrammingExerciseEditor.vue'
import { isValidProgrammingExercise } from '@/validation'
import UIButton from './UIButton.vue'
import { bulkCreateProgrammingExercises } from '@/api/items'

export default defineComponent({
  components: {
    ProgrammingExerciseEditor,
    UIButton
  },
  //components: { Fullexercise },
  name: 'ProgrammingExerciseImport',
  data () {
    return {
      exercises: [] as ProgrammingExercise[],
      topics: [] as Topic[],
      skippedIndices: [] as number[]
    }
  },
  async created () {
    await this.updateTopics()
  },
  methods: {
    async updateTopics () {
      const courseId = this.$route.params.courseId as string
      this.topics = await getTopics(courseId)
    },
    async _importexercises () {
      const courseId = this.$route.params.courseId as string
      await bulkCreateProgrammingExercises(courseId, this.nonSkippedExercises)
      this.exercises = []
      this.skippedIndices = []

      this.$store.commit('pushNotification', {
        message: 'Esercizi importati con successo',
        autoHide: 2500,
        severity: 1
      })
    },
    processFile (event: HTMLInputEvent) {
      console.log(event.target?.files)
      const fileReader = new FileReader()
      fileReader.onload = e => {
        try {
          const content = JSON.parse(e.target?.result as string)
          this.processContent(content)
        } catch (exception) {
          this.$store.commit('pushNotification', {
            message: `Errore nella lettura del file: ${exception}`,
            autoHide: 5000,
            severity: 2
          })
        }
      }

      fileReader.readAsText(event.target?.files?.item(0) as File)
    },
    processContent (content: unknown) {
      this.exercises = content as ProgrammingExercise[]
      //this.exercises.forEach(q => (q.difficulty = '2'))
    }
  },
  computed: {
    valid (): boolean {
      return this.exercises
        .map(exercise => isValidProgrammingExercise(exercise))
        .every(val => val)
    },
    nonSkippedExercises (): ProgrammingExercise[] {
      return this.exercises.filter((_e, i) => !this.skippedIndices.includes(i))
    }
  }
})
</script>

<style></style>
