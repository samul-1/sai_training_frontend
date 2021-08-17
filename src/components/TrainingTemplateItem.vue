<template>
  <div class="px-10 py-6 border rounded-lg w-max">
    <h1 class="mb-4 text-xl">{{ trainingTemplate.name }}</h1>
    <TrainingTemplateRule
      v-for="(rule, index) in trainingTemplate.rules"
      :key="'template-' + trainingTemplate.id + '-rule-' + index"
      :rule="rule"
    ></TrainingTemplateRule>
  </div>
</template>

<script lang="ts">
import { TrainingTemplate } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'
import TrainingTemplateRule from '@/components/TrainingTemplateRule.vue'

export default defineComponent({
  name: 'TrainingTemplateItem',
  props: {
    trainingTemplate: {
      type: Object as PropType<TrainingTemplate>
    }
  },
  components: { TrainingTemplateRule }
})
</script>

<style></style>
