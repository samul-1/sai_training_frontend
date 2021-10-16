<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course-panel/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al pannello del
        corso</UIButton
      ></router-link
    >
  </teleport>
  <div class="">
    <h1 class="mb-4 text-4xl">Modelli di esercitazione</h1>
    <p class="mb-4">
      I modelli sono utilizzati dagli studenti quando iniziano una nuova
      esercitazione. Ogni modello definisce, per ogni argomento del corso,
      quante domande vengono scelte e con quale distribuzione di difficoltà
      quando lo studente inizia un'esercitazione. Puoi utilizzare questa
      funzionalità per creare template di esercitazioni incentrate solo su
      alcuni argomenti, oppure per simulare le prove d'esame o le verifiche
      intermedie.
    </p>
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
        v-if="loading"
        style="min-height: 200px !important"
        class="h-auto px-10 py-6 border rounded-xl"
      >
        <skeleton></skeleton>
      </div>
      <div
        @click="showTemplateEditor = true"
        style="min-height: 200px !important"
        class="flex flex-col h-auto px-10 py-6 text-gray-400 border rounded-md cursor-pointer bg-gradient-to-b from-gray-50 to-gray-100"
      >
        <h1 class="-mb-2 text-xl">Nuovo modello</h1>
        <div class="flex my-auto text-6xl">
          <i class="mx-auto my-auto fas fa-plus-circle"></i>
        </div>
      </div>
    </div>

    <modal
      v-if="showTemplateEditor"
      :title="`${editing ? 'Modifica' : 'Crea'} modello`"
      :yesText="'Salva'"
      :noText="'Annulla'"
      :disableOk="!draftTemplateValid"
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
          @validity="draftTemplateValid = $event"
          :template="templates.find(template => template.id == editing)"
          ref="templateEditor"
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
import { defineComponent, Ref } from '@vue/runtime-core'
import UIButton from '@/components/UIButton.vue'
import TrainingTemplateEditor from '@/components/TrainingTemplateEditor.vue'
import Modal from '@/components/Modal.vue'
import Skeleton from '@/components/Skeleton.vue'
export default defineComponent({
  name: 'CouseTrainingTemplates',
  components: {
    TrainingTemplateItem,
    UIButton,
    TrainingTemplateEditor,
    Modal,
    Skeleton
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
      draftTemplateValid: false,
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
