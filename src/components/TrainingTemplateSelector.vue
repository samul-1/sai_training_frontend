<template>
  <div class="relative h-full p-12 pb-20 mx-6 border shadow-xl rounded-xl">
    <h1 class="mb-4 text-3xl">Nuova esercitazione</h1>
    <p class="mb-4">Scegli un modello per l'esercitazione o creane uno.</p>
    <div class="flex flex-col space-y-6 md:space-y-0 md:space-x-6 md:flex-row">
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
    </div>
    <UIButton
      class="absolute bottom-0 right-0 mb-8 mr-12"
      :variant="'green'"
      :disabled="!selected"
      @click="$emit('setTemplate', selected)"
      ><i class="mr-1 fas fa-check"></i>Conferma</UIButton
    >
  </div>
</template>

<script lang="ts">
import { getTrainingTemplates } from '@/api/courses'
import { TrainingTemplate } from '@/interfaces'
import TrainingTemplateItem from '@/components/TrainingTemplateItem.vue'
import { defineComponent } from '@vue/runtime-core'
import UIButton from '@/components/UIButton.vue'

export default defineComponent({
  name: 'TrainingTemplateSelector',
  components: {
    TrainingTemplateItem,
    UIButton
  },
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  async created () {
    this.templates = await getTrainingTemplates(this.courseId)
  },
  data () {
    return {
      templates: [] as TrainingTemplate[],
      selected: null
    }
  }
})
</script>

<style></style>
