<template>
  <h1 class="mb-8 text-4xl text-center">Domande</h1>
  <div class="flex my-12">
    <p class="my-auto mr-8 font-medium">Filtra per</p>
    <div class="flex my-auto mr-8 space-x-2">
      <input class="my-auto" type="checkbox" v-model="filterByTopic" />
      <p>Argomento</p>
      <p>
        <select
          v-model="filterTopic"
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
        v-model="filterByDifficulty"
      />
      <p class="mr-8">Difficoltà</p>
      <difficulty-input
        class="w-80"
        v-model="filterDifficulty"
      ></difficulty-input>
    </div>
    <UIButton
      :disabled="showDraft"
      @click="showDraft = true"
      class="ml-auto"
      :variant="'green'"
      >Nuova domanda</UIButton
    >
  </div>

  <Skeleton v-if="loading"></Skeleton>
  <QuestionEditor
    class="my-4"
    v-if="showDraft"
    v-model="draftQuestion"
    :startCollapsed="false"
    :topicChoices="topics"
    :showSave="true"
    @save="saveQuestion(draftQuestion)"
  ></QuestionEditor>

  <QuestionEditor
    class="my-4"
    v-for="(question, index) in questions"
    :key="'q-' + question.id"
    v-model="questions[index]"
    :startCollapsed="true"
    :topicChoices="topics"
    :showSave="true"
    @save="saveQuestion(question)"
  ></QuestionEditor>
</template>

<script lang="ts">
import { getTopics } from '@/api/courses'
import { createQuestion, getQuestions, updateQuestion } from '@/api/items'
import DifficultyInput from '@/components/DifficultyInput.vue'
import QuestionEditor from '@/components/QuestionEditor.vue'
import UIButton from '@/components/UIButton.vue'
import Skeleton from '@/components/Skeleton.vue'
import { Choice, Question, Topic } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  components: { Skeleton, QuestionEditor, DifficultyInput, UIButton },
  name: 'CourseQuestionList',
  async created () {
    const courseId = this.$route.params.courseId as string
    this.loading = true
    this.questions = await getQuestions(courseId, null)
    this.topics = await getTopics(courseId)
    this.loading = false
  },
  data () {
    return {
      questions: [] as Question[],
      filterDifficulty: '2',
      filterTopic: '',
      filterByDifficulty: false,
      filterByTopic: false,
      topics: [] as Topic[],
      loading: false,
      showDraft: false,
      draftQuestion: {
        id: '_',
        text: '',
        topic: '',
        solution: '',
        difficulty: '2',
        choices: [] as Choice[]
      } as Question
    }
  },
  methods: {
    async saveQuestion (question: Question): Promise<void> {
      const courseId = this.$route.params.courseId as string

      if (question.id != '_') {
        const response = await updateQuestion(courseId, question)
        this.questions[
          this.questions.findIndex(q => question.id === q.id)
        ] = response
      } else {
        const response = await createQuestion(courseId, question)
        this.questions.unshift(response)
        this.draftQuestion = {
          id: '_',
          text: '',
          topic: '',
          solution: '',
          difficulty: '2',
          choices: [] as Choice[]
        } as Question
        this.$store.commit('pushNotification', {
          message: 'Domanda creata con successo',
          autoHide: 1500,
          severity: 1
        })
        this.showDraft = false
      }
    }
  }
})
</script>

<style></style>
