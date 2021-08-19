<template>
  <div>
    <div
      class="grid grid-cols-3 gap-2 mt-6 mb-2 text-lg font-medium md:grid-cols-7"
    >
      <h1 class="col-span-2">Argomento</h1>
      <h1>Quantità</h1>
      <h1 class="hidden col-span-3 md:block">Distribuzione difficoltà</h1>
    </div>
    <div v-if="!loading">
      <div
        v-for="topic in topics"
        class="grid grid-cols-2 gap-2 my-10 md:my-4 md:grid-cols-7"
        :key="'topic-' + topic.id"
      >
        <div class="col-span-2">{{ topic.name }}</div>
        <input
          class="w-16 px-2 py-0.5 ml-2 border rounded-lg"
          type="number"
          v-model="template.rules.find(rule => rule.topic == topic.name).amount"
        />
        <DifficultyProfile
          class="col-span-3 border-b pb-14 md:pb-0 md:border-b-0"
          :readOnly="false"
          v-model="
            template.rules.find(rule => rule.topic == topic.name)
              .difficulty_profile
          "
        ></DifficultyProfile>
      </div>
    </div>
    <skeleton v-else></skeleton>
    <teleport v-if="!loading" to="#training-template-editor-footer">
      <p>
        <strong class="font-medium">Totale domande:</strong>
        {{ questionsTotal }}
      </p>
    </teleport>
  </div>
</template>

<script lang="ts">
import { getTopics } from '@/api/courses'
import { Topic, TrainingTemplate, TrainingTemplateRule } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { profiles } from '@/difficultyProfiles'
import DifficultyProfile from './DifficultyProfile.vue'
import Skeleton from './Skeleton.vue'

export default defineComponent({
  components: { DifficultyProfile, Skeleton },
  name: 'TrainingTemplateEditor',
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  watch: {
    templateAsJSON (newVal) {
      this.$emit('update', newVal)
    }
  },
  async created () {
    this.loading = true
    this.topics = await getTopics(this.courseId)
    this.topics.forEach((topic: Topic) => {
      this.template.rules.push({
        topic: topic.name,
        amount: 0,
        difficulty_profile: 'balanced'
      } as TrainingTemplateRule)
    })
    this.loading = false
  },
  data () {
    return {
      loading: false,
      topics: [] as Topic[],
      template: {
        rules: [] as TrainingTemplateRule[]
      } as TrainingTemplate,
      profiles
    }
  },
  computed: {
    templateAsJSON () {
      return JSON.stringify(this.template)
    },
    questionsTotal () {
      return this.template.rules
        .map(rule => rule.amount)
        .reduce((acc, curr) => acc + curr, 0)
    }
  }
})
</script>

<style></style>
