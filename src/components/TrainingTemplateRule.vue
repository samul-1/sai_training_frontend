<template>
  <div class="flex space-x-2">
    <p><span class="text-indigo-900">Argomento:</span> {{ rule.topic }}</p>
    <p>
      {{ rule.amount }}
      <span class="text-indigo-900"
        >domand{{ rule.amount == 1 ? 'a' : 'e' }}</span
      >
    </p>
    <p>{{ rule.difficulty_profile }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TrainingTemplateRule } from '@/interfaces'

export default defineComponent({
  name: 'TrainingTemplateRule',
  props: {
    rule: {
      type: Object as PropType<TrainingTemplateRule>
    }
  }
})
</script>

<style></style>
