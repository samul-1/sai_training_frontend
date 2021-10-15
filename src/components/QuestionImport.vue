<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course-panel/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al pannello del
        corso</UIButton
      ></router-link
    >
  </teleport>
  <h1 class="mb-8 text-4xl text-center">Importa domande</h1>
  <div>
    <div class="ml-4">
      <ol class="list-decimal">
        <li :class="{ 'text-green-800': questions.length }">
          Seleziona un file in formato <strong>JSON</strong> contenente una
          lista di domande.
          <i class="ml-2 fas fa-check" v-if="questions.length"></i>
        </li>
        <li :class="{ 'text-green-800': questions.length && valid }">
          Per ogni domanda, seleziona un argomento in cui includerla e un
          livello di difficoltà.
          <i class="ml-2 fas fa-check" v-if="questions.length && valid"></i>
        </li>
        <li>Clicca su <strong>Importa</strong>.</li>
      </ol>
    </div>
    <input
      v-if="!questions.length"
      type="file"
      @change="processFile"
      class="mt-4 mb-10"
    />
    <div class="flex items-center my-4 space-x-2" v-else>
      <p>Imposta lo stesso argomento per tutte le domande:</p>
      <select
        v-model="selectedTopicForAll"
        class="col-span-5 md:col-span-4 p-0.5 bg-white border rounded-md"
      >
        <option :value="''" selected disabled class="text-red-900"
          >Seleziona un argomento</option
        >
        <option
          class="text-black bg-white"
          v-for="topic in topics"
          :key="'global-topic-' + topic.id"
          :value="topic.id"
          >{{ topic.name }}</option
        >
      </select>
      <UIButton
        @click="setTopicToAll()"
        :size="'sm'"
        :disabled="selectedTopicForAll == ''"
        >Imposta</UIButton
      >
    </div>
  </div>
  <div
    class="relative grid grid-cols-10 gap-20 my-4 mr-10"
    v-for="(question, index) in questions"
    :key="'q-tmp-' + index"
  >
    <div
      v-if="skippedIndices.includes(index)"
      class="absolute text-gray-900 transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
    >
      Questa domanda non verrà importata.
      <span
        @click="skippedIndices.splice(skippedIndices.indexOf(index), 1)"
        class="font-medium text-blue-800 cursor-pointer"
        >Annulla</span
      >
    </div>
    <QuestionEditor
      class="col-span-10"
      v-model="questions[index]"
      :topicChoices="topics"
      @updateTopics="updateTopics()"
      @delete="skippedIndices.push(index)"
      :class="{
        'opacity-40 pointer-events-none': skippedIndices.includes(index)
      }"
      :showSave="false"
      :startCollapsed="true"
      :questionTempKey="index"
    ></QuestionEditor>
  </div>
  <UIButton
    @click="_importQuestions()"
    v-if="questions.length"
    :variant="'green'"
    :disabled="!valid || !questions.length"
    >Importa</UIButton
  >
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { getTopics } from '@/api/courses'
import { HTMLInputEvent, Question, Topic } from '@/interfaces'
import QuestionEditor from './QuestionEditor.vue'
import { isValidQuestion } from '@/validation'
import UIButton from './UIButton.vue'
import { bulkCreateQuestions } from '@/api/items'

export default defineComponent({
  components: { QuestionEditor, UIButton },
  //components: { FullQuestion },
  name: 'QuestionImport',
  data () {
    return {
      questions: [] as Question[],
      topics: [] as Topic[],
      skippedIndices: [] as number[],
      selectedTopicForAll: '' as string
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
    async _importQuestions () {
      const courseId = this.$route.params.courseId as string
      await bulkCreateQuestions(courseId, this.nonSkippedQuestions)
      this.questions = []
      this.skippedIndices = []

      this.$store.commit('pushNotification', {
        message: 'Domande importate con successo',
        autoHide: 2500,
        severity: 1
      })
    },
    setTopicToAll () {
      this.questions.forEach(
        q => (q.topic = this.selectedTopicForAll as string)
      )
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
      this.questions = content as Question[]
      //this.questions.forEach(q => (q.difficulty = '2'))
    }
  },
  computed: {
    nonSkippedQuestions (): Question[] {
      return this.questions.filter((_q, i) => !this.skippedIndices.includes(i))
    },
    valid (): boolean {
      return this.nonSkippedQuestions
        .map(question => isValidQuestion(question))
        .every(val => val)
    }
  }
})
</script>

<style></style>
