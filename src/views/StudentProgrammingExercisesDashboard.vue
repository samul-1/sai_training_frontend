<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al
        corso</UIButton
      ></router-link
    >
  </teleport>
  <div><h1 class="mb-8 text-4xl">Esercizi JavaScript</h1></div>
  <div class="flex flex-col mb-6 md:flex-row">
    <p class="md:w-4/5">
      Gli esercizi che visualizzi vengono salvati nella tua cronologia
      personale. Se non li completi, puoi recuperarli dalla cronologia in un
      secondo momento.
    </p>
    <router-link :to="`/course/${$route.params.courseId}/exercises/history`">
      <UIButton :variant="'indigo'" class="my-4 md:my-auto md:ml-auto"
        >Visualizza cronologia</UIButton
      ></router-link
    >
  </div>
  <div v-if="loading">
    <skeleton></skeleton>
    <skeleton></skeleton>
  </div>
  <div class="grid gap-4 md:grid-cols-2">
    <div
      class="flex px-4 py-6 border rounded-2xl hover:shadow-inner"
      v-for="topic in topics"
      :key="'topic-' + topic.id"
    >
      <p class="mr-4 text-lg">{{ topic.name }}</p>
      <UIButton
        @click="selectedTopic = topic.id"
        :variant="'green'"
        :size="'xs'"
        class="my-auto ml-auto"
        >Avvia <span class="hidden md:inline">esercitazione</span></UIButton
      >
    </div>
  </div>
  <Modal
    v-if="selectedTopic"
    :title="'Avvia esercitazione'"
    :yesText="'Avvia'"
    :noText="'Annulla'"
    :dismissible="true"
    :disableOk="amount <= 0"
    @no="cancelSession()"
    @yes="startSession()"
  >
    <template v-slot:body>
      <div class="flex mb-6">
        <p class="mr-2">Numero di esercizi</p>
        <input
          class="w-16 px-2 py-0.5 ml-2 border rounded-lg"
          type="number"
          v-model="amount"
          :class="{
            'bg-red-100 text-red-900 border-red-200': amount <= 0
          }"
        />
      </div>
      <div class="flex flex-col md:flex-row">
        <p class="mr-12">Distribuzione difficoltà</p>
        <DifficultyProfile
          class="border-b md:w-3/5 pb-14 md:pb-0 md:border-b-0"
          :readOnly="false"
          v-model="difficultyProfile"
        ></DifficultyProfile>
      </div>
    </template>
  </Modal>
</template>

<script lang="ts">
import { getTopics } from '@/api/courses'
import DifficultyProfile from '@/components/DifficultyProfile.vue'
import Modal from '@/components/Modal.vue'
import Skeleton from '@/components/Skeleton.vue'
import UIButton from '@/components/UIButton.vue'
import { Topic } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  name: 'StudentProgrammingExercisesDashboard',
  async created () {
    const courseId = this.$route.params.courseId as string

    this.loading = true
    this.topics = await getTopics(courseId)
    this.loading = false
  },
  components: { Skeleton, UIButton, Modal, DifficultyProfile },
  data () {
    return {
      loading: false,
      amount: 0,
      difficultyProfile: 'balanced',
      selectedTopic: null as string | null,
      topics: [] as Topic[]
    }
  },
  methods: {
    startSession () {
      const courseId = this.$route.params.courseId as string
      const params = {
        topicId: this.selectedTopic as string,
        difficultyProfile: this.difficultyProfile,
        amount: this.amount
      }
      localStorage.setItem(
        `exercise_session_${courseId}`,
        JSON.stringify(params)
      )
      this.$router.push({
        path: 'exercises/train',
        name: 'StudentProgrammingExerciseSession',
        params
      })
    },
    cancelSession () {
      this.selectedTopic = null
      this.amount = 0
      this.difficultyProfile = 'balanced'
    }
  }
})
</script>

<style></style>
