<template>
  <div>QuestionImport</div>
  <input
    type="file"
    @change="processFile"
    class="transition-all duration-200"
  />
  <!-- <div
    v-if="questions.length"
    class="grid grid-cols-10 gap-12 my-4 text-xl font-medium"
  >
    <div class="col-span-5">Domanda</div>
    <div class="col-span-2">Argomento</div>
    <div class="col-span-2">Difficoltà</div>
  </div> -->
  <div
    class="grid grid-cols-10 gap-20 my-4 mr-10"
    v-for="(question, index) in questions"
    :key="'q-tmp-' + index"
  >
    <!--       :question="question"
 -->
    <question-editor
      class="col-span-10"
      v-model="questions[index]"
      :topicChoices="topics"
      :startCollapsed="true"
    ></question-editor>

    <!-- <div class="col-span-5 overflow-x-auto" v-html="question.text"></div>
    <select
      v-model="questions[index].topic"
      class="col-span-2 bg-white border rounded-md p"
    >
      <option
        v-for="topic in topics"
        :key="'topic-' + topic.id"
        :value="topic.id"
        >{{ topic.name }}</option
      >
    </select>
    <difficulty-input
      class="col-span-3"
      v-model="questions[index].difficulty"
    ></difficulty-input> -->
  </div>
  <difficulty-input class="hidden col-span-3"></difficulty-input>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { getTopics } from '@/api/courses'
import { HTMLInputEvent, Question, Topic } from '@/interfaces'
import DifficultyInput from './DifficultyInput.vue'
import QuestionEditor from './QuestionEditor.vue'
//import FullQuestion from './FullQuestion.vue'

export default defineComponent({
  components: { DifficultyInput, QuestionEditor },
  //components: { FullQuestion },
  name: 'QuestionImport',
  data () {
    return {
      questions: [] as Question[],
      topics: [] as Topic[]
    }
  },
  async created () {
    const courseId = this.$route.params.courseId as string
    this.topics = await getTopics(courseId)
  },
  methods: {
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
  }
})
</script>

<style></style>
