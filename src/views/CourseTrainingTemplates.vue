<template>
  <!--<div class="relative h-full p-12 pb-20 mx-6 border shadow-xl rounded-xl">-->
  <div class="my-6">
    <h1 class="mb-4 text-3xl">Modelli di esercitazione</h1>
    <!-- <p class="mb-4">Scegli un modello per l'esercitazione o creane uno.</p> -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <TrainingTemplateItem
        v-for="template in templates"
        :key="'template-' + template.id"
        :trainingTemplate="template"
        class="transition-all duration-75 cursor-pointer hover:shadow-inner"
        @click="editing = template.id"
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

    <modal
      v-if="showTemplateEditor"
      :title="`${editing ? 'Modifica' : 'Crea'} modello`"
      :yesText="'Salva'"
      :noText="'Annulla'"
      @no="discard()"
      @yes="saveTrainingTemplate()"
      :large="true"
    >
      <template v-slot:body>
        <!-- <p class="mb-2">
          Seleziona il numero di domande per ogni argomento e la distribuzione
          di difficoltà delle domande. Questo modello verrà usato immediatamente
          per l'esercitazione che stai per iniziare.
        </p> -->
        <TrainingTemplateEditor
          :courseId="$route.params.courseId"
          :showFullForm="true"
          @update="updateDraftTemplate($event)"
          :template="templates.find(template => template.id == editing)"
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
import {
  createTrainingTemplate,
  getTrainingTemplates,
  updateTrainingTemplate
} from '@/api/courses'
import { TrainingTemplate } from '@/interfaces'
import TrainingTemplateItem from '@/components/TrainingTemplateItem.vue'
import { defineComponent } from '@vue/runtime-core'
//import UIButton from '@/components/UIButton.vue'
import TrainingTemplateEditor from '@/components/TrainingTemplateEditor.vue'
import Modal from '@/components/Modal.vue'

export default defineComponent({
  name: 'CouseTrainingTemplates',
  components: {
    TrainingTemplateItem,
    // UIButton,
    TrainingTemplateEditor,
    Modal
  },
  watch: {
    editing (newVal) {
      if (newVal) {
        this.showTemplateEditor = true
      } else {
        this.drafTemplate = {} as TrainingTemplate
      }
    }
  },
  async created () {
    this.loading = true
    const courseId = this.$route.params.courseId as string
    this.templates = await getTrainingTemplates(courseId)
    this.loading = false
  },
  data () {
    return {
      templates: [] as TrainingTemplate[],
      editing: null as string | null,
      showTemplateEditor: false,
      drafTemplate: {} as TrainingTemplate,
      loading: false
    }
  },
  methods: {
    discard () {
      this.editing = null
      this.showTemplateEditor = false
    },
    updateDraftTemplate (newVal: string) {
      this.drafTemplate = JSON.parse(newVal)
    },
    async saveTrainingTemplate () {
      const courseId = this.$route.params.courseId as string
      let response
      if (this.editing) {
        response = await updateTrainingTemplate(
          courseId,
          this.editing,
          this.drafTemplate
          // this.templates.find(
          //   template => template.id === this.editing
          // ) as TrainingTemplate
        )
        this.templates[
          this.templates.findIndex(template => template.id == this.editing)
        ] = response
      } else {
        response = await createTrainingTemplate(courseId, this.drafTemplate)
        this.templates.push(response)
      }
      this.$store.commit('pushNotification', {
        message: 'Modello salvato con successo',
        autoHide: 2000,
        severity: 1
      })
      this.showTemplateEditor = false
      this.editing = null
      //this.$emit('setTemplate', response.id)
    }
  }
})
</script>

<style></style>
