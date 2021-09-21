<template>
  <teleport to="#nav-buttons">
    <router-link to="/courses/">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna alla lista dei
        corsi</UIButton
      ></router-link
    >
  </teleport>
  <div v-if="loading">
    <Skeleton class="ml-60" :singleLine="true"></Skeleton>
  </div>
  <div class="h-full">
    <h1 class="-mb-2 text-3xl text-center md:text-4xl">{{ course.name }}</h1>
    <!-- <p v-if="course.description?.length" v-html="course.description"></p> -->
    <div
      class="relative flex flex-col w-full mx-auto space-y-6 transform -translate-y-1/2 top-1/2 md:w-max"
    >
      <router-link :to="`/course/${$route.params.courseId}/train/`"
        ><UIButton :variant="'indigo'" :size="'xl'" class="w-full"
          >{{
            course.in_progress_session ? 'Continua' : 'Inizia'
          }}
          esercitazione</UIButton
        ></router-link
      >
      <router-link :to="`/course/${$route.params.courseId}/sessions/`">
        <UIButton :variant="'indigo'" :size="'xl'" class="w-full"
          >Cronologia esercitazioni</UIButton
        ></router-link
      >
    </div>
  </div>
  <modal
    v-if="!loading && !course?.enrolled"
    @yes="enroll()"
    @no="$router.push('/courses')"
    :title="'Nuova iscrizione'"
  >
    <template v-slot:body
      >Vuoi iscriverti al corso
      <span class="font-medium">{{ course?.name }}</span
      >?</template
    >
  </modal>
</template>

<script lang="ts">
import { getCourse } from '@/api/courses'
import Modal from '@/components/Modal.vue'
import UIButton from '@/components/UIButton.vue'
import { Course } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { enroll } from '@/api/courses'
import Skeleton from '@/components/Skeleton.vue'

export default defineComponent({
  components: { UIButton, Modal, Skeleton },
  name: 'StudentCourseDashboard',
  async created () {
    const courseId = this.$route.params.courseId as string
    this.loading = true
    this.course = await getCourse(courseId)
    this.loading = false
  },
  data () {
    return {
      course: {} as Course,
      loading: false
    }
  },
  methods: {
    async enroll (): Promise<void> {
      const courseId = this.$route.params.courseId as string
      this.course = await enroll(courseId)
      this.$store.commit('pushNotification', {
        message: 'Iscrizione avvenuta con successo',
        autoHide: 2500,
        severity: 1
      })
    }
  }
})
</script>

<style></style>
