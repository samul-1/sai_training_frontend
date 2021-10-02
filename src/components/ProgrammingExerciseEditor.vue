<template>
  <div
    class="relative px-12 py-10 transition-shadow duration-100 border border-gray-200 rounded-lg hover:shadow-lg"
  >
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
          v-model="exerciseData.topic"
          class="col-span-5 md:col-span-4 p-0.5 bg-white border rounded-md"
          :class="{
            'bg-red-100 text-red-900 border border-red-200': !exerciseData.topic
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
              'q-' + exerciseData.id ?? exerciseTempKey + '-topic-' + topic.id
            "
            :value="topic.id"
            >{{ topic.name }}</option
          >
        </select>
      </div>
      <div class="grid grid-cols-5 md:gap-24 lg:gap-32">
        <h1 class="font-medium">Difficoltà</h1>
        <difficulty-input
          class="col-span-5 md:col-span-4"
          v-model="exerciseData.difficulty"
        ></difficulty-input>
      </div>
    </div>
    <div v-if="!collapse">
      <h1 class="mb-2 font-medium">Testo</h1>
      <!-- <textarea
        rows="5"
        cols="100"
        class="p-3 border rounded-lg"
        v-model="exerciseData.text"
      ></textarea> -->
      <RichEditor v-model="exerciseData.text"></RichEditor>
      <h1 class="mt-4 mb-2 font-medium">
        Soluzione (opzionale, mostrata a fine esercitazione)
      </h1>
      <!-- <textarea
        rows="5"
        cols="100"
        class="p-3 border rounded-lg"
        v-model="exerciseData.solution"
      ></textarea> -->
      <RichEditor v-model="exerciseData.solution"></RichEditor>

      <div class="flex mt-4 mb-2 space-x-2 ">
        <h1 class="font-medium">Test case</h1>
        <UIButton :variant="'green'" :size="'2xs'" @click="pushNewTestCase()"
          >Nuovo</UIButton
        >
      </div>
      <transition-group name="bounce">
        <div
          v-for="(testcase, c_index) in exerciseData.testcases"
          :key="'q-' + exerciseData.id ?? exerciseTempKey + '-c-' + c_index"
          class="flex mt-2"
        >
          <RichEditor class="w-10/12" v-model="testcase.code"></RichEditor>
          <!-- <div class="my-auto ml-4">
            <input
              type="checkbox"
              v-model="testcase.correct"
              class="mr-1"
            /><label>Corretta</label>
          </div> -->
          <UIButton
            @click="exerciseData.testcases.splice(c_index, 1)"
            class="my-auto ml-4"
            :variant="'negative-red'"
            :size="'xs'"
            ><i class="fas fa-trash"></i
          ></UIButton>
        </div>
      </transition-group>
    </div>
    <div
      v-highlight
      v-else
      v-html="highlightCode(exerciseData.text)"
      class="overflow-x-auto overflow-y-auto break-words max-h-32"
    ></div>
    <div class="flex mt-8 space-x-2" v-if="showSave">
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
      <p
        v-if="dirty"
        class="px-2 my-auto text-white bg-gray-600 rounded-md animate-pulse"
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
          cols="50"
          rows="4"
          class="p-1 border rounded-lg"
          v-model="draftTopic.help_text"
          placeholder="Questo testo verrà mostrato agli studenti che sbagliano più del 50% delle domande di questo argomento."
        ></textarea></template
    ></modal>
    <!-- <modal
      :title="'Anteprima domanda'"
      :large="true"
      v-if="showPreview"
      @yes="showPreview = false"
      :dismissible="true"
      :confirmOnly="true"
    >
      <template v-slot:body>
        <FullQuestion :showIcon="false" :question="exerciseData"></FullQuestion
      ></template>
    </modal> -->
  </div>
</template>

<script lang="ts">
import { TestCase, ProgrammingExercise, Topic } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import DifficultyInput from './DifficultyInput.vue'
import RichEditor from './RichEditor.vue'
import UIButton from './UIButton.vue'
import { renderTex } from '@/utils'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Modal from './Modal.vue'
import { createTopic } from '@/api/courses'
import { isValidProgrammingExercise } from '@/validation'
import { highlightCode } from '@/utils'
export default defineComponent({
  name: 'ProgrammingExerciseEditor',
  components: { DifficultyInput, UIButton, Modal, RichEditor },
  props: {
    modelValue: {
      type: Object as PropType<ProgrammingExercise>,
      required: true
    },
    exerciseTempKey: {
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
 watch: {
    exerciseAsJSON (newVal: string, oldVal : string) {
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
    exerciseTopic(newVal: string) {
      if(newVal == '_') {
        this.showTopicCreation = true
      }
    }

  },
  created () {
    this.exerciseData = { ...this.modelValue }
    this.exerciseData.topic ??= ""
    this.exerciseData.difficulty ??= "2"
    this.collapse = this.startCollapsed
    renderTex()
  },
  data() {
    return {
      dirty: false,
      showPreview: false,
      exerciseData: {} as ProgrammingExercise,
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
    pushNewTestCase() {
        this.exerciseData.testcases.push({
            code: "",
        } as TestCase)
    },
    async _createTopic (): Promise<void> {
      const courseId = this.$route.params.courseId as string
      const { id, ...rest } = this.draftTopic // throw away the dummy id
      try {
        const response = await createTopic(courseId, rest)
        this.$emit("updateTopics")
        this.exerciseData.topic = response.id as string
        this.draftTopic = {
          name: "", help_text: ""
        }
        this.showTopicCreation = false
      } catch(exception) {
        this.cancelTopicCreation()
      }

    },
    cancelTopicCreation() : void {
      this.exerciseData.topic = ""
      this.showTopicCreation = false
    }
  },
  computed: {
    exerciseAsJSON (): string {
      return JSON.stringify(this.exerciseData)
    },
    exerciseTopic() : string {
      return this.exerciseData.topic
    },
    valid() : boolean {
      return isValidProgrammingExercise(this.exerciseData)
    }
  }
})
</script>

<style></style>
