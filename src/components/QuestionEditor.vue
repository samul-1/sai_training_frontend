<template>
  <div
    class="relative px-4 pb-10 transition-shadow duration-100 border border-gray-200 rounded-lg pt-14 md:px-12 hover:shadow-lg"
  >
    <div class="absolute top-0 left-0 mt-4 ml-4">
      <UIButton
        v-if="collapsible"
        @click="$emit('delete')"
        :size="'2xs'"
        :variant="'negative-red'"
        ><i class="fas fa-trash"></i
      ></UIButton>
    </div>
    <div class="absolute top-0 right-0 mt-4 mr-4">
      <UIButton
        v-if="collapsible"
        @click="collapse = !collapse"
        :size="'2xs'"
        :variant="'negative'"
        ><i
          class="fas"
          :class="{ 'fa-expand-alt': collapse, 'fa-compress-alt': !collapse }"
        ></i
      ></UIButton>
    </div>
    <div class="grid mb-10 md:mb-0 md:gap-24 md:grid-cols-2">
      <div class="grid grid-cols-5 mb-8">
        <h1 class="font-medium">Argomento</h1>
        <select
          v-model="questionData.topic"
          class="col-span-5 md:col-span-4 p-0.5 bg-white border rounded-md"
          :class="{
            'bg-red-100 text-red-900 border border-red-200': !questionData.topic
          }"
        >
          <option :value="''" selected disabled class="text-red-900"
            >Seleziona un argomento</option
          >
          <option :value="'_'" class="text-green-900 bg-green-100"
            >Nuovo argomento...</option
          >
          <option
            class="text-black bg-white"
            v-for="topic in topicChoices"
            :key="
              'q-' + questionData.id ?? questionTempKey + '-topic-' + topic.id
            "
            :value="topic.id"
            >{{ topic.name }}</option
          >
        </select>
      </div>
      <div class="grid grid-cols-5 md:gap-24 lg:gap-32">
        <h1 class="font-medium">Difficoltà</h1>
        <difficulty-input
          class="col-span-5 ml-4 md:ml-0 md:col-span-4"
          v-model="questionData.difficulty"
        ></difficulty-input>
      </div>
    </div>
    <div v-if="!collapse">
      <div class="flex flex-col mb-4 md:space-x-2 md:flex-row">
        <p class="my-auto font-medium">
          Domanda
          {{ questionData.is_open_ended ? 'aperta' : 'a risposta multipla' }}
        </p>
        <UIButton
          @click="toggleOpenQuestion()"
          class="mt-2 md:mt-0"
          :variant="'negative'"
          :size="'xs'"
          >Cambia in domanda
          {{
            questionData.is_open_ended ? 'a risposta multipla' : 'aperta'
          }}</UIButton
        >
      </div>
      <h1 class="mb-2 font-medium">Testo</h1>
      <RichEditor v-model="questionData.text"></RichEditor>
      <h1 class="mt-4 mb-2 font-medium">
        Soluzione (opzionale, mostrata a fine esercitazione)
      </h1>
      <RichEditor v-model="questionData.solution"></RichEditor>
      <div v-if="!questionData.is_open_ended">
        <div class="flex mt-4 mb-2 space-x-2 ">
          <h1 class="font-medium">Risposte</h1>
          <UIButton :variant="'green'" :size="'2xs'" @click="pushNewChoice()"
            >Nuova</UIButton
          >
        </div>
        <transition-group name="bounce">
          <div
            v-for="(choice, c_index) in questionData.choices"
            :key="'q-' + questionData.id ?? questionTempKey + '-c-' + c_index"
            class="flex flex-col mt-2 md:flex-row"
          >
            <RichEditor
              class="w-full md:w-10/12"
              v-model="choice.text"
            ></RichEditor>
            <div class="my-auto mt-2 md:ml-4 md:mt-0">
              <input
                type="checkbox"
                v-model="choice.correct"
                class="mr-1"
              /><label>Corretta</label>
              <UIButton
                @click="questionData.choices.splice(c_index, 1)"
                class="my-auto ml-4"
                :variant="'negative-red'"
                :size="'xs'"
                ><i class="fas fa-trash"></i
              ></UIButton>
            </div>
          </div>
        </transition-group>
      </div>
    </div>
    <div
      v-highlight
      v-else
      v-html="highlightCode(questionData.text)"
      class="overflow-x-auto overflow-y-auto break-words max-h-32"
    ></div>
    <div class="flex flex-col mt-8 md:space-x-2 md:flex-row" v-if="showSave">
      <div class="flex space-x-2">
        <UIButton
          :disabled="!valid || !dirty"
          @click="$emit('save')"
          class="my-auto"
          :variant="'green'"
          >Salva</UIButton
        >
        <UIButton
          class="my-auto"
          @click="showPreview = true"
          :variant="'negative'"
          >Anteprima</UIButton
        >
      </div>
      <p
        v-if="dirty"
        class="px-2 mt-2 text-white bg-gray-600 rounded-md md:my-auto animate-pulse"
      >
        Modifiche non salvate
      </p>
    </div>
    <modal
      v-if="showTopicCreation"
      :title="'Nuovo argomento'"
      :yesText="'Crea'"
      :noText="'Annulla'"
      :disableOk="draftTopic.name.length == 0"
      @no="cancelTopicCreation()"
      @yes="_createTopic()"
      ><template v-slot:body>
        <h1 class="mt-2 font-medium">Nome argomento</h1>
        <input
          class="border rounded-md p px-1.5"
          type="text"
          v-model="draftTopic.name"/>
        <h1 class="mt-2 font-medium">Testo di aiuto (opzionale)</h1>
        <textarea
          rows="4"
          class="w-full p-1 border rounded-lg"
          v-model="draftTopic.help_text"
          placeholder="Questo testo verrà mostrato agli studenti che sbagliano più del 50% delle domande di questo argomento."
        ></textarea></template
    ></modal>
    <modal
      :title="'Anteprima domanda'"
      :large="true"
      v-if="showPreview"
      @yes="showPreview = false"
      :dismissible="true"
      :confirmOnly="true"
    >
      <template v-slot:body>
        <FullQuestion :showIcon="false" :question="questionData"></FullQuestion
      ></template>
    </modal>
  </div>
</template>

<script lang="ts">
import { Choice, Question, Topic } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import DifficultyInput from './DifficultyInput.vue'
import RichEditor from './RichEditor.vue'
import UIButton from './UIButton.vue'
import { renderTex } from '@/utils'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Modal from './Modal.vue'
import { createTopic } from '@/api/courses'
import { isValidQuestion } from '@/validation'
import { highlightCode } from "@/utils"
import FullQuestion from './FullQuestion.vue'

export default defineComponent({
  name: 'QuestionEditor',
  components: {
    DifficultyInput,
    UIButton,
    Modal,
    RichEditor,
    FullQuestion
  },
  props: {
    modelValue: {
      type: Object as PropType<Question>,
      required: true
    },
    questionTempKey: {
        type: [String, Number],
        required: false
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
    },
    showSave: {
      type: Boolean,
      default: true,
    }
  },
  created () {
    this.questionData = { ...this.modelValue }
    this.questionData.topic ??= ""
    this.questionData.difficulty ??= "2"
    this.collapse = this.startCollapsed
    renderTex()
  },
  watch: {
    questionAsJSON (newVal: string, oldVal : string) {
      // console.log("new", newVal, "old", oldVal)
      this.$emit('update:modelValue', JSON.parse(newVal))
      if(!this.dirty && newVal != oldVal && oldVal != JSON.stringify({})) {
        this.dirty = true
      }
    },
    collapse(newVal:boolean) {
      if(newVal) {
        renderTex()
      }
    },
    showPreview(newVal:boolean) {
      if(newVal) {
        setTimeout(() => renderTex(), 1000)
      }
    },
    questionTopic(newVal: string) {
      if(newVal == '_') {
        this.showTopicCreation = true
      }
    }

  },
  data () {
    return {
      dirty: false,
      showPreview: false,
      questionData: {} as Question,
      collapse: false,
      showTopicCreation: false,
      draftTopic: {
        name:"",
        help_text:""
      } as Topic
    }
  },
  methods: {
    highlightCode,
    toggleOpenQuestion() {
      if(this.questionData.is_open_ended) {
        this.questionData.is_open_ended = false
      } else {
        if(this.questionData.choices.length == 0 ||
            this.questionData.choices.length > 0 && confirm(
              'Se trasformi questa domanda in una domanda aperta, le risposte che hai già aggiunto verranno cancellate. Confermi l\'operazione?'
          )) {
          this.questionData.is_open_ended = true
          this.questionData.choices = []
        }
      }
    },
    pushNewChoice() {
        this.questionData.choices.push({
            text: "",
            correct: false,
        } as Choice)
    },
    async _createTopic (): Promise<void> {
      const courseId = this.$route.params.courseId as string
      const { id, ...rest } = this.draftTopic // throw away the dummy id
      try {
        const response = await createTopic(courseId, rest)
        this.$emit("updateTopics")
        this.questionData.topic = response.id as string
        this.draftTopic = {
          name: "", help_text: ""
        }
        this.showTopicCreation = false
      } catch(exception) {
        this.cancelTopicCreation()
      }

    },
    cancelTopicCreation() : void {
      this.questionData.topic = ""
      this.showTopicCreation = false
    }
  },
  computed: {
    questionAsJSON (): string {
      return JSON.stringify(this.questionData)
    },
    questionTopic() : string {
      return this.questionData.topic
    },
    valid() : boolean {
      return isValidQuestion(this.questionData)
    }
  }
})
</script>

<style></style>
