<template>
  <div
    class="relative px-12 py-10 transition-shadow duration-100 border rounded-lg hover:shadow-md"
  >
    <div class="absolute top-0 right-0 mt-4 mr-4">
      <UIButton
        v-if="collapsible"
        @click="collapse = !collapse"
        :size="'2xs'"
        :variant="'negative'"
        ><i class="fas fa-compress-alt"></i
      ></UIButton>
    </div>
    <div class="grid mb-10 md:mb-0 md:gap-24 md:grid-cols-2">
      <div class="grid grid-cols-5 mb-8">
        <h1 class="font-medium">Argomento</h1>
        <select
          v-model="questionData.topic"
          class="col-span-4 bg-white border rounded-md p"
          :class="{
            'bg-red-100 text-red-900 border border-red-200': !questionData.topic
          }"
        >
          <option :value="''" selected disabled class="text-red-900"
            >Seleziona un argomento</option
          >
          <option
            class="text-black bg-white"
            v-for="topic in topicChoices"
            :key="'topic-' + topic.id"
            :value="topic.id"
            >{{ topic.name }}</option
          >
        </select>
      </div>
      <div class="grid grid-cols-5 md:gap-24 lg:gap-32">
        <h1 class="font-medium">Difficoltà</h1>
        <difficulty-input
          class="col-span-4"
          v-model="questionData.difficulty"
        ></difficulty-input>
      </div>
    </div>
    <div v-if="!collapse">
      <h1 class="mb-2 font-medium">Testo</h1>
      <textarea
        rows="5"
        cols="100"
        class="p-3 border rounded-lg"
        v-model="questionData.text"
        @change="update('text', questionData.text)"
      ></textarea>
      <div class="flex mt-4 mb-2 space-x-2 ">
        <h1 class="font-medium">Risposte</h1>
        <UIButton :variant="'green'" :size="'2xs'" @click="pushNewChoice()"
          >Nuova</UIButton
        >
      </div>
      <div
        v-for="(choice, c_index) in questionData.choices"
        :key="'q-' + Math.random() + '-c-' + c_index"
        class="flex mt-2"
      >
        <textarea
          rows="2"
          cols="90"
          class="p-3 border rounded-lg"
          v-model="choice.text"
          @change="update('text', questionData.text)"
        ></textarea>
        <div class="my-auto ml-4">
          <input type="checkbox" v-model="choice.correct" class="mr-1" /><label
            >Corretta</label
          >
        </div>
      </div>
    </div>
    <div
      v-else
      v-html="questionData.text"
      class="overflow-x-auto overflow-y-auto break-words max-h-20"
    ></div>
  </div>
</template>

<script lang="ts">
import { Choice, Question, Topic } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import DifficultyInput from './DifficultyInput.vue'
import UIButton from './UIButton.vue'

//import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

export default defineComponent({
  name: 'QuestionEditor',
  components: {
    DifficultyInput,
    UIButton
  },
  props: {
    modelValue: {
      type: Object as PropType<Question>,
      required: true
    },
    collapsible: {
        type: Boolean,
        default: true,
    },
    startCollapsed: {
        type: Boolean,
        default: false,
    },
    topicChoices: {
      type: Array as PropType<Topic[]>,
      required: true
    }
  },
  created () {
    this.questionData = { ...this.modelValue }
    this.questionData.topic ??= ""
    this.questionData.difficulty ??= "2"
    this.collapse = this.startCollapsed
  },
  watch: {
    questionAsJSON (newVal: string) {
      this.$emit('update:modelValue', JSON.parse(newVal))
    }
  },
  data () {
    return {
      questionData: {} as Question,
      collapse: false
    }
  },
  methods: {
    pushNewChoice() {
        this.questionData.choices.push({
            text: "",
            correct: false,
        } as Choice)
    }
  },
  computed: {
    questionAsJSON (): string {
      return JSON.stringify(this.questionData)
    }
  }
})
</script>

<style></style>
