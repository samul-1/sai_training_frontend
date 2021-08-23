<template>
  <h1 class="mb-8 text-4xl text-center">{{ course.name }}</h1>
  <!-- <p v-if="course.description?.length" v-html="course.description"></p> -->
  <div class="flex flex-col mx-auto space-y-6 w-max">
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
        >Cronologia eserciazioni</UIButton
      ></router-link
    >
  </div>
  <modal
    v-if="!loading && !course?.enrolled"
    @yes="enroll()"
    @no="$router.push('/courses')"
    :title="'Nuova iscrizione'"
  >
    Vuoi iscriverti al corso <span class="font-medium">{{ course?.name }}</span
    >?
  </modal>
</template>

<script lang="ts">
import { getCourse } from '@/api/courses'
import Modal from '@/components/Modal.vue'
import UIButton from '@/components/UIButton.vue'
import { Course } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import { enroll } from '@/api/courses'

export default defineComponent({
  components: { UIButton, Modal },
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
