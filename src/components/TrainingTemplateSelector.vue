<template>
  <div class="relative h-full p-12 mx-6 border shadow-xl rounded-xl">
    <p class="mb-4 ">Scelgi un modello per l'esercitazione o creane uno.</p>
    <TrainingTemplateItem
      v-for="template in templates"
      :key="'template-' + template.id"
      :trainingTemplate="template"
      :class="{
        'ring-green-600 ring-inset ring ring-opacity-60 bg-gray-50':
          template.id == selected
      }"
      @click="selected = template.id"
    >
    </TrainingTemplateItem>
    <UIButton
      class="absolute right-0 mr-12"
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
