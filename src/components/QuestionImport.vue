<template>
  <h1 class="mb-8 text-4xl text-center">Importa domande</h1>
  <div>
    <p>
      Seleziona un file in formato <strong>JSON</strong> contenente una lista di
      domande. Per ogni domanda, seleziona un argomento in cui includerla e un
      livello di difficoltà.
    </p>
    <input
      v-if="!questions.length"
      type="file"
      @change="processFile"
      class="mt-4 mb-10"
    />
    <!-- get rid of this -->
    <div v-if="!questions.length" class="w-20 h-80"></div>
  </div>
  <div
    class="grid grid-cols-10 gap-20 my-4 mr-10"
    v-for="(question, index) in questions"
    :key="'q-tmp-' + index"
  >
    <question-editor
      class="col-span-10"
      v-model="questions[index]"
      :topicChoices="topics"
      @updateTopics="updateTopics()"
      :startCollapsed="true"
      :questionTempKey="index"
    ></question-editor>
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
      topics: [] as Topic[]
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
      await bulkCreateQuestions(courseId, this.questions)
      this.questions = []

      this.$store.commit('pushNotification', {
        message: 'Domande importate con successo',
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
      this.questions = content as Question[]
      //this.questions.forEach(q => (q.difficulty = '2'))
    }
  },
  computed: {
    valid (): boolean {
      return this.questions
        .map(question => isValidQuestion(question))
        .every(val => val)
    }
  }
})
</script>

<style></style>
