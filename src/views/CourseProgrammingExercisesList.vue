<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course-panel/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al pannello del
        corso</UIButton
      ></router-link
    >
  </teleport>
  <h1 class="mb-8 text-4xl text-center">Esercizi JS</h1>
  <div class="flex my-12">
    <p class="my-auto mr-8 font-medium">Filtra per</p>
    <div class="flex my-auto mr-8 space-x-2">
      <input
        class="my-auto"
        type="checkbox"
        v-model="filter.byTopic"
        id="filter-by-topic"
      />
      <label for="filter-by-topic">Argomento</label>
      <p>
        <select
          v-model="filter.topic"
          class="col-span-4 p-0.5 bg-white border rounded-md"
        >
          <option :value="''" selected disabled class="text-red-900"
            >Seleziona un argomento</option
          >
          <option
            class="text-black bg-white"
            v-for="topic in topics"
            :key="'filter-topic-' + topic.id"
            :value="topic.id"
            >{{ topic.name }}</option
          >
        </select>
      </p>
    </div>
    <div class="flex my-auto">
      <input
        class="my-auto mr-2"
        type="checkbox"
        id="filter-by-difficulty"
        v-model="filter.byDifficulty"
      />
      <label for="filter-by-difficulty" class="mr-8">Difficoltà</label>
      <difficulty-input
        class="w-80"
        v-model="filter.difficulty"
      ></difficulty-input>
    </div>
  </div>
  <div class="flex">
    <UIButton
      :disabled="showDraft"
      class="ml-auto"
      @click="showDraft = true"
      :variant="'green'"
      >Nuovo esercizio</UIButton
    >
    <!-- <router-link :to="`/course-panel/${$route.params.courseId}/import`"
      ><UIButton :variant="'negative'" class="ml-2">
        Importa da JSON
      </UIButton></router-link
    > -->
  </div>

  <Skeleton v-if="firstLoading"></Skeleton>
  <Spinner v-if="loading"></Spinner>

  <transition name="bounce">
    <ProgrammingExerciseEditor
      class="my-4"
      v-if="showDraft"
      v-model="draftExercise"
      :startCollapsed="false"
      :topicChoices="topics"
      :showSave="true"
      @updateTopics="updateTopics()"
      @save="saveExercise(draftExercise)"
    ></ProgrammingExerciseEditor>
  </transition>

  <ProgrammingExerciseEditor
    class="my-4 even:bg-gray-50"
    v-for="(exercise, index) in exercises"
    :key="'e-' + exercise.id"
    v-model="exercises[index]"
    :startCollapsed="true"
    :topicChoices="topics"
    :showSave="true"
    :ref="'exercise-editor-' + exercise.id"
    @updateTopics="updateTopics()"
    @save="saveExercise(exercise)"
  ></ProgrammingExerciseEditor>

  <div class="mt-6 text-center">
    <p
      @click="currentPage = currentPage + 1"
      class="text-gray-600 underline cursor-pointer hover:text-gray-800"
    >
      Carica più domande
    </p>
  </div>
</template>

<script lang="ts">
import { getTopics } from '@/api/courses'
import {
  createProgrammingExercise,
  getProgrammingExercises,
  updateProgrammingExercise
} from '@/api/items'
import DifficultyInput from '@/components/DifficultyInput.vue'
import ProgrammingExerciseEditor from '@/components/ProgrammingExerciseEditor.vue'
import UIButton from '@/components/UIButton.vue'
import Skeleton from '@/components/Skeleton.vue'
import { ProgrammingExercise, TestCase, Topic } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import Spinner from '@/components/Spinner.vue'

export default defineComponent({
  components: {
    Skeleton,
    DifficultyInput,
    UIButton,
    Spinner,
    ProgrammingExerciseEditor
  },
  name: 'CourseProgrammingExerciseList',
  async created () {
    window.addEventListener('beforeunload', this.beforeWindowUnload)

    const courseId = this.$route.params.courseId as string
    this.firstLoading = true
    this.exercises = await getProgrammingExercises(courseId, null, null, 1)
    this.topics = await getTopics(courseId)
    this.firstLoading = false
  },
  beforeUnmount () {
    window.removeEventListener('beforeunload', this.beforeWindowUnload)
  },
  beforeRouteLeave (_to, _from, next) {
    if (this.confirmStayInDirtyForm()) {
      next(false)
    } else {
      next()
    }
  },
  watch: {
    filterAsJSON: {
      async handler (_newVal, _oldVal) {
        console.log('firing')
        const newVal = JSON.parse(_newVal)
        const oldVal = JSON.parse(_oldVal)
        if (
          (newVal.topic != oldVal.topic && !newVal.byTopic) ||
          (newVal.difficulty != oldVal.difficulty && !newVal.byDifficulty)
        ) {
          return
        }
        this.currentPage = 1
        await this.reloadExercises(true)
      }
    },
    async currentPage (_newVal) {
      await this.reloadExercises(false)
    }
  },
  data () {
    return {
      currentPage: 1,
      exercises: [] as ProgrammingExercise[],
      filter: {
        difficulty: '2',
        topic: '',
        byDifficulty: false,
        byTopic: false
      },
      topics: [] as Topic[],
      loading: false,
      firstLoading: false,
      showDraft: false,
      draftExercise: {
        id: '_',
        text: '',
        topic: '',
        solution: '',
        difficulty: '2',
        testcases: [] as TestCase[]
      } as ProgrammingExercise
    }
  },
  methods: {
    confirmLeave () {
      return window.confirm(
        'Hai effettuato delle modifiche che non hai salvato. Sei sicuro di voler uscire dalla pagina?'
      )
    },
    confirmStayInDirtyForm () {
      return this.dirty && !this.confirmLeave()
    },
    beforeWindowUnload (e: {
      preventDefault: () => void
      returnValue: string
    }) {
      if (this.confirmStayInDirtyForm()) {
        // Cancel the event
        e.preventDefault()
        // Chrome requires returnValue to be set
        e.returnValue = ''
      }
    },
    async updateTopics () {
      const courseId = this.$route.params.courseId as string
      this.topics = await getTopics(courseId)
    },
    async reloadExercises (overwrite: boolean): Promise<void> {
      const courseId = this.$route.params.courseId as string
      try {
        this.loading = true
        const response = await getProgrammingExercises(
          courseId,
          this.filter.byTopic ? this.filter.topic : null,
          this.filter.byDifficulty ? this.filter.difficulty : null,
          this.currentPage
        )
        if (overwrite) {
          this.exercises = response
        } else {
          this.exercises = [...this.exercises, ...response]
        }
      } finally {
        this.loading = false
      }
    },
    async saveExercise (exercise: ProgrammingExercise): Promise<void> {
      const courseId = this.$route.params.courseId as string
      this.loading = true

      try {
        if (exercise.id != '_') {
          const response = await updateProgrammingExercise(courseId, exercise)
          this.exercises[
            this.exercises.findIndex(e => exercise.id === e.id)
          ] = response

          // remove the "unsaved changes" warning from editor and collapse it
          ;(this.$refs['exercise-editor-' + exercise.id] as {
            dirty: boolean
          }).dirty = false
          ;(this.$refs['exercise-editor-' + exercise.id] as {
            collapse: boolean
          }).collapse = true
          this.$store.commit('pushNotification', {
            message: 'Esercizio aggiornato con successo',
            autoHide: 1500,
            severity: 1
          })
        } else {
          const response = await createProgrammingExercise(courseId, exercise)
          this.exercises.unshift(response)
          this.draftExercise = {
            id: '_',
            text: '',
            topic: '',
            solution: '',
            difficulty: '2',
            testcases: [] as TestCase[]
          } as ProgrammingExercise
          this.$store.commit('pushNotification', {
            message: 'Esercizio creato con successo',
            autoHide: 1500,
            severity: 1
          })
          this.showDraft = false
        }
      } finally {
        this.loading = false
      }
    }
  },
  computed: {
    filterAsJSON (): string {
      return JSON.stringify(this.filter)
    },
    dirty (): boolean {
      // returns true if any of the question editors are dirty
      return this.exercises
        .map(e => {
          return (this.$refs['exercise-editor-' + e.id] as { dirty: boolean })
            .dirty
        })
        .reduce((a, b) => a || b, false)
    }
  }
})
</script>

<style></style>
