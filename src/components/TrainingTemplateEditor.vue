<template>
  <div>
    <div v-if="showFullForm">
      <h1 class="mb-2 text-lg font-medium ">Nome modello</h1>
      <textarea
        class="w-full p-3 border rounded-lg"
        v-model="templateData.name"
        rows="1"
        cols="90"
      ></textarea>
      <h1 class="mb-2 text-lg font-medium ">Descrizione (opzionale)</h1>
      <textarea
        rows="2"
        cols="90"
        class="w-full p-3 border rounded-lg"
        v-model="templateData.description"
      ></textarea>
    </div>
    <div
      class="grid grid-cols-4 gap-8 mt-6 mb-2 text-lg font-medium md:gap-16 md:grid-cols-8"
    >
      <h1 class="col-span-2 ml-1 md:ml-0">Argomento</h1>
      <h1 class="ml-6 md:col-span-2 md:ml-0">Quantità</h1>
      <h1 class="hidden col-span-3 md:block">Distribuzione difficoltà</h1>
    </div>
    <div v-if="!loading">
      <div
        v-for="topic in topics"
        class="grid grid-cols-2 gap-10 mx-2 my-10 md:mx-0 md:my-4 md:grid-cols-8"
        :key="'topic-' + topic.id"
      >
        <div class="col-span-2">{{ topic.name }}</div>
        <div class="flex col-span-2 space-x-2">
          <input
            class="w-16 px-2 py-0.5 ml-2 border rounded-lg"
            type="number"
            :max="topic.items_count"
            min="0"
            v-model="
              templateData.rules.find(rule => rule.topic == topic.name).amount
            "
            :class="{
              'bg-red-100 text-red-900 border-red-200':
                templateData.rules.find(rule => rule.topic == topic.name)
                  .amount < 0
            }"
          />
          <UIButton
            @click="
              templateData.rules.find(rule => rule.topic == topic.name).amount =
                topic.items_count
            "
            :size="'2xs'"
            :variant="'light'"
            >Tutte</UIButton
          >
        </div>
        <DifficultyProfile
          class="col-span-4 ml-4 mr-1 transition-opacity duration-200 border-b md:ml-0 md:mr-0 pb-14 md:pb-0 md:border-b-0"
          :class="{
            'opacity-20 pointer-events-none':
              templateData.rules.find(rule => rule.topic == topic.name)
                .amount >= topic.items_count
          }"
          :readOnly="false"
          v-model="
            templateData.rules.find(rule => rule.topic == topic.name)
              .difficulty_profile
          "
        ></DifficultyProfile>
      </div>
    </div>
    <Skeleton v-else></Skeleton>
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
import { defineComponent, PropType } from '@vue/runtime-core'
import { profiles } from '@/difficultyProfiles'
import DifficultyProfile from './DifficultyProfile.vue'
import Skeleton from './Skeleton.vue'
import UIButton from '@/components/UIButton.vue'

export default defineComponent({
  components: {
    DifficultyProfile,
    Skeleton,
    UIButton
  },
  name: 'TrainingTemplateEditor',
  props: {
    courseId: {
      type: String,
      required: true
    },
    template: {
      type: Object as PropType<TrainingTemplate>,
      required: false
    },
    showFullForm: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    templateAsJSON (newVal) {
      this.$emit('update', newVal)
    },
    valid (newVal) {
      this.$emit('validity', newVal)
    }
  },
  async created () {
    this.loading = true
    this.topics = await getTopics(this.courseId)
    if (this.template) {
      this.fillInEmptyRules()
    } else {
      this.topics.forEach((topic: Topic) => {
        this.templateData.rules.push({
          topic: topic.name,
          amount: 0,
          difficulty_profile: 'balanced'
        } as TrainingTemplateRule)
      })
    }
    this.loading = false
  },
  data () {
    return {
      loading: false,
      topics: [] as Topic[],
      templateData: {
        rules: [] as TrainingTemplateRule[]
      } as TrainingTemplate,
      profiles
    }
  },
  methods: {
    fillInEmptyRules (): void {
      this.templateData = JSON.parse(JSON.stringify(this.template)) //{ ...(this.template as TrainingTemplate) }
      this.topics.forEach(topic => {
        if (!this.templateData.rules.find(rule => rule.topic == topic.name)) {
          this.templateData.rules.push({
            topic: topic.name,
            amount: 0,
            difficulty_profile: 'balanced'
          })
        }
      })
    }
  },
  computed: {
    templateAsJSON (): string {
      return JSON.stringify(this.templateWithoutEmptyRules)
    },
    templateWithoutEmptyRules (): TrainingTemplate {
      const { rules, ...rest } = this.templateData
      const nonEmptyrules = rules.filter(rule => rule.amount != 0)
      return {
        rules: nonEmptyrules,
        ...rest
      }
    },
    questionsTotal () {
      return this.templateData.rules
        .map(rule => rule.amount)
        .reduce((acc, curr) => acc + curr, 0)
    },
    valid (): boolean {
      return (
        this.templateWithoutEmptyRules.rules.length > 0 &&
        !this.templateWithoutEmptyRules.rules.some(rule => rule.amount < 0)
      )
    }
  }
})
</script>

<style></style>
