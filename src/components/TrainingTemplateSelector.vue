<template>
  <!--<div class="relative h-full p-12 pb-20 mx-6 border shadow-xl rounded-xl">-->
  <div class="my-6">
    <h1 class="mb-4 text-3xl">Nuova esercitazione</h1>
    <p class="mb-4">Scegli un modello per l'esercitazione o creane uno.</p>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TrainingTemplateItem
        v-for="template in templates"
        :key="'template-' + template.id"
        :trainingTemplate="template"
        class="transition-all duration-75 cursor-pointer"
        :class="{
          'ring-green-600 ring-inset ring ring-opacity-60 bg-green-50':
            template.id == selected
        }"
        @click="selected = template.id"
      >
      </TrainingTemplateItem>
      <div
        @click="showTemplateEditor = true"
        class="px-10 py-6 text-gray-400 border cursor-pointer rounded-xl h-44 bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <h1 class="mb-4 text-xl">Nuovo modello personalizzato</h1>
        <div class="flex text-6xl">
          <i class="mx-auto my-auto fas fa-plus-circle"></i>
        </div>
      </div>
    </div>
    <!-- class="absolute bottom-0 right-0 mb-8 mr-12"-->
    <UIButton
      class="mt-10"
      :variant="'green'"
      :disabled="!selected"
      @click="$emit('setTemplate', selected)"
      ><!--<i class="mr-1 fas fa-check"></i>-->Conferma</UIButton
    >
    <modal
      v-if="showTemplateEditor"
      :title="'Crea modello personalizzato'"
      :yesText="'Crea e usa'"
      :noText="'Annulla'"
      @no="showTemplateEditor = false"
      @yes="_createTrainingTemplate()"
      :large="true"
    >
      <template v-slot:body>
        <p class="mb-2">
          Seleziona il numero di domande per ogni argomento e la distribuzione
          di difficoltà delle domande. Questo modello verrà usato immediatamente
          per l'esercitazione che stai per iniziare.
        </p>
        <TrainingTemplateEditor
          :courseId="$route.params.courseId"
          @update="updateDraftTemplate($event)"
        ></TrainingTemplateEditor>
      </template>
      <template v-slot:footerButtons>
        <div id="training-template-editor-footer"></div
      ></template>
    </modal>
  </div>
  <!--</div>-->
</template>

<script lang="ts">
import { createTrainingTemplate, getTrainingTemplates } from '@/api/courses'
import { TrainingTemplate } from '@/interfaces'
import TrainingTemplateItem from '@/components/TrainingTemplateItem.vue'
import { defineComponent } from '@vue/runtime-core'
import UIButton from '@/components/UIButton.vue'
import TrainingTemplateEditor from '@/components/TrainingTemplateEditor.vue'
import Modal from './Modal.vue'

export default defineComponent({
  name: 'TrainingTemplateSelector',
  components: {
    TrainingTemplateItem,
    UIButton,
    TrainingTemplateEditor,
    Modal
  },
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  async created () {
    this.loading = true
    this.templates = await getTrainingTemplates(this.courseId)
    this.loading = false
  },
  data () {
    return {
      templates: [] as TrainingTemplate[],
      selected: null as string | null,
      showTemplateEditor: false,
      drafTemplate: {} as TrainingTemplate,
      loading: false
    }
  },
  methods: {
    updateDraftTemplate (newVal: string) {
      this.drafTemplate = JSON.parse(newVal)
    },
    async _createTrainingTemplate () {
      const courseId = this.$route.params.courseId as string
      const response = await createTrainingTemplate(courseId, this.drafTemplate)
      this.showTemplateEditor = false
      this.$emit('setTemplate', response.id)
    }
  }
})
</script>

<style></style>
