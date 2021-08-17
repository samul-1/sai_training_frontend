<template>
  <div class="flex my-1.5">
    <i class="my-auto text-xs fas fa-caret-right"></i>
    <p class="mx-2">
      {{ rule.amount }}
      <span>domand{{ rule.amount == 1 ? 'a' : 'e' }}</span>
      <span class="mx-1.5 text-gray-600 font-light">su</span>

      <span>{{ rule.topic }}</span>
    </p>
    <DifficultyProfile
      :readOnly="true"
      :profile="rule.difficulty_profile"
    ></DifficultyProfile>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { TrainingTemplateRule } from '@/interfaces'
import DifficultyProfile from '@/components/DifficultyProfile.vue'

export default defineComponent({
  name: 'TrainingTemplateRule',
  components: { DifficultyProfile },
  props: {
    rule: {
      type: Object as PropType<TrainingTemplateRule>
    }
  }
})
</script>

<style></style>
