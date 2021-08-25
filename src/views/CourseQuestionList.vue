<template>
  <h1 class="mb-8 text-4xl text-center">Domande</h1>
  <div class="flex my-12">
    <p class="my-auto mr-8 font-medium">Filtra per</p>
    <div class="flex my-auto mr-8 space-x-2">
      <input class="my-auto" type="checkbox" v-model="filter.byTopic" />
      <p>Argomento</p>
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
        v-model="filter.byDifficulty"
      />
      <p class="mr-8">Difficoltà</p>
      <difficulty-input
        class="w-80"
        v-model="filter.difficulty"
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

  <Skeleton v-if="firstLoading"></Skeleton>
  <Spinner v-if="loading"></Spinner>

  <QuestionEditor
    class="my-4"
    v-if="showDraft"
    v-model="draftQuestion"
    :startCollapsed="false"
    :topicChoices="topics"
    :showSave="true"
    @updateTopics="updateTopics()"
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
    @updateTopics="updateTopics()"
    @save="saveQuestion(question)"
  ></QuestionEditor>

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
import { createQuestion, getQuestions, updateQuestion } from '@/api/items'
import DifficultyInput from '@/components/DifficultyInput.vue'
import QuestionEditor from '@/components/QuestionEditor.vue'
import UIButton from '@/components/UIButton.vue'
import Skeleton from '@/components/Skeleton.vue'
import { Choice, Question, Topic } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import Spinner from '@/components/Spinner.vue'

export default defineComponent({
  components: { Skeleton, QuestionEditor, DifficultyInput, UIButton, Spinner },
  name: 'CourseQuestionList',
  async created () {
    const courseId = this.$route.params.courseId as string
    this.firstLoading = true
    this.questions = await getQuestions(courseId, null, null, 1)
    this.topics = await getTopics(courseId)
    this.firstLoading = false
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
        await this.reloadQuestions(true)
      }
    },
    async currentPage (_newVal) {
      await this.reloadQuestions(false)
    }
  },
  data () {
    return {
      currentPage: 1,
      questions: [] as Question[],
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
    async updateTopics () {
      const courseId = this.$route.params.courseId as string
      this.topics = await getTopics(courseId)
    },
    async reloadQuestions (overwrite: boolean): Promise<void> {
      const courseId = this.$route.params.courseId as string
      try {
        this.loading = true
        const response = await getQuestions(
          courseId,
          this.filter.byTopic ? this.filter.topic : null,
          this.filter.byDifficulty ? this.filter.difficulty : null,
          this.currentPage
        )
        if (overwrite) {
          this.questions = response
        } else {
          this.questions = [...this.questions, ...response]
        }
      } finally {
        this.loading = false
      }
    },
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
  },
  computed: {
    filterAsJSON (): string {
      return JSON.stringify(this.filter)
    }
  }
})
</script>

<style></style>
