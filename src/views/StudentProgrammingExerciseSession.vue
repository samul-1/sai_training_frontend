<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al
        corso</UIButton
      >
    </router-link>
  </teleport>
  <div class="flex w-full h-full border rounded-lg shadow-lg">
    <div class="w-1/5 h-full border-r rounded-tl-lg rounded-bl-lg bg-gray-50">
      <div
        class="flex px-4 transition-colors duration-100 border-b cursor-pointer h-14 hover:bg-gray-100 active:bg-gray-200"
        :class="{
          'bg-gray-200 hover:bg-gray-200': currentExerciseId === exercise.id,
          'rounded-tl-lg': index === 0
        }"
        v-for="(exercise, index) in exercises"
        :key="'e-' + exercise.id"
        @click="currentExerciseId = exercise.id"
      >
        <p class="my-auto">Esercizio {{ index + 1 }}</p>
      </div>
    </div>
    <div class="flex flex-col w-4/5 h-full">
      <div class="flex w-full h-8 bg-gray-900 rounded-tr-lg">
        <button
          class="px-4 py-1 mt-auto mr-1 text-gray-900 transition-colors duration-100 bg-gray-200 rounded-tr cursor-pointer hover:bg-gray-300 active:bg-gray-200"
          @click="currentPane = 0"
          :class="{ 'bg-gray-300 font-medium': currentPane == 0 }"
        >
          Testo
        </button>
        <button
          class="px-4 py-1 mt-auto mr-1 text-gray-900 transition-colors duration-100 bg-gray-200 rounded-t cursor-pointer hover:bg-gray-300 active:bg-gray-200"
          @click="currentPane = 1"
          :class="{ 'bg-gray-300 font-medium': currentPane == 1 }"
        >
          Editor
        </button>
        <button
          class="px-4 py-1 mt-auto text-gray-900 transition-colors duration-100 bg-gray-200 rounded-t cursor-pointer hover:bg-gray-300 active:bg-gray-200"
          @click="currentPane = 2"
          :class="{ 'bg-gray-300 font-medium': currentPane == 2 }"
        >
          Sottomissioni
        </button>
        <button
          class="px-4 py-1 mt-auto ml-auto text-white transition-colors duration-100 bg-green-700 rounded-tl rounded-tr-lg cursor-pointer hover:bg-green-800 active:bg-green-900"
          @click="submitCode()"
        >
          Esegui codice
        </button>
      </div>
      <div class="h-full" id="editor-pane">
        <div class="p-4" v-show="currentPane == 0">
          <skeleton v-if="loading"></skeleton>

          <div v-html="currentExercise.text"></div>

          <h2 v-if="!loading" class="mt-4 mb-2 text-lg font-medium">
            Test case
          </h2>
          <div
            v-for="(testcase, index) in currentExercise.testcases"
            :key="'current-e-' + index"
            v-highlight
            v-html="codify(testcase.code)"
          ></div>
        </div>
        <div class="h-full bg-gray-900 rounded-br-lg" v-show="currentPane == 1">
          <VAceEditor
            v-model:value="currentExercise.draftCode"
            lang="javascript"
            theme="monokai"
            :style="editorStyle"
            :options="aceEditorOptions"
          />
        </div>
        <div class="h-full p-4 overflow-y-auto" v-show="currentPane == 2">
          <ProgrammingExerciseSubmission
            v-for="(submission, index) in reversedCurrentExerciseSubmissions"
            :key="'e-' + currentExercise.id + 's-' + submission.id"
            :submission="submission"
            :index="
              currentExercise
                ? currentExercise.submissions.length - index - 1
                : 0
            "
          ></ProgrammingExerciseSubmission>
          <p
            v-if="
              currentExercise.submissions &&
                currentExercise.submissions.length == 0
            "
          >
            Non ci sono sottomissioni.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { getRandomProgrammingExercises } from '@/api/items'
import {
  DifficultyProfile,
  ExerciseSubmission,
  ProgrammingExercise
} from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import UIButton from '@/components/UIButton.vue'
import { codify } from '@/utils'
import { VAceEditor } from 'vue3-ace-editor'
import Skeleton from '@/components/Skeleton.vue'
import 'ace-builds/src-noconflict/mode-javascript'
import 'ace-builds/src-noconflict/theme-monokai'
import ProgrammingExerciseSubmission from '@/components/ProgrammingExerciseSubmission.vue'

export default defineComponent({
  name: 'StudentProgrammingExerciseSession',
  components: {
    UIButton,
    VAceEditor,
    Skeleton,
    ProgrammingExerciseSubmission
  },
  props: {
    topicId: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true
    },
    difficultyProfile: {
      type: String as PropType<DifficultyProfile>,
      required: true
    }
  },
  async created () {
    const courseId = this.$route.params.courseId as string

    this.loading = true
    this.exercises = await getRandomProgrammingExercises(
      courseId,
      this.topicId,
      this.difficultyProfile,
      this.amount
    )
    this.exercises.forEach(e => (e.draftCode = ''))
    this.currentExerciseId = this.exercises[0].id
    this.loading = false
  },
  data () {
    return {
      exercises: [] as ProgrammingExercise[],
      aceEditorOptions: {
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        fontSize: 17,
        highlightActiveLine: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
        showPrintMargin: false,
        showGutter: true
      },
      currentExerciseId: '_',
      pane: 0,
      codes: [] as { id: string; code: string }[],
      loading: false,
      panes: new Map() as Map<string, number>
    }
  },
  methods: {
    codify
  },
  computed: {
    currentExercise (): ProgrammingExercise {
      return (
        this.exercises.find(e => e.id === this.currentExerciseId) ??
        ({} as ProgrammingExercise)
      )
    },
    currentPane: {
      get (): number {
        return this.panes.get(this.currentExerciseId) ?? 0
      },
      set (newVal: number): void {
        this.panes.set(this.currentExerciseId, newVal)
      }
    },
    editorStyle (): string {
      console.log(document.getElementById('editor-pane')?.offsetHeight)
      return this.currentPane == 1
        ? 'height: ' +
            document.getElementById('editor-pane')?.offsetHeight +
            'px;'
        : ''
    },
    reversedCurrentExerciseSubmissions (): ExerciseSubmission[] {
      return ((this.currentExercise?.submissions ??
        []) as ExerciseSubmission[]).reduce(
        (r: ExerciseSubmission[], e: ExerciseSubmission) => [e, ...r],
        []
      )
    }
  }
})
</script>

<style>
.ace-monokai {
  background-color: #1f2937 !important;
  color: #f8f8f2;
}

.ace-monokai .ace_marker-layer .ace_active-line {
  background: #2f3e53 !important;
}

.ace-monokai .ace_gutter {
  background: #111827 !important;
  color: #8f908a;
}

.ace-monokai .ace_gutter-active-line {
  background-color: #2f3e53 !important;
}

.ace_editor {
  border-bottom-right-radius: 0.5rem !important;
}
</style>
