<template>
  <div class="flex flex-col h-full">
    <h1 class="mb-2 text-4xl text-center">I tuoi corsi</h1>
    <p class="mt-20" v-if="!loading && courses.length == 0">
      Non ci sono corsi. Creane uno!
    </p>
    <div v-if="loading">
      <div
        v-for="i in [1, 2]"
        :key="'skeleton-' + i"
        class="p-4 my-4 border rounded-2xl hover:shadow-inner"
      >
        <Skeleton :short="true"></Skeleton>
      </div>
    </div>
    <div class="mb-2">
      <CourseListItem
        v-for="course in courses"
        :key="'course-' + course.id"
        :course="course"
      ></CourseListItem>
    </div>

    <UIButton
      class="mt-auto w-max"
      :variant="'green'"
      @click="showCourseCreation = true"
      >Crea nuovo corso</UIButton
    >
  </div>
  <modal
    :large="true"
    v-if="showCourseCreation"
    @yes="_createCourse()"
    @no="showCourseCreation = false"
    :disableOk="draftCourse.name.length == 0"
    :yesText="'Crea'"
    :noText="'Annulla'"
    :confirmOnly="false"
    :title="'Crea nuovo corso'"
  >
    <template v-slot:body>
      <CourseEditor @update="updateDraftCourse($event)"></CourseEditor>
    </template>
    <template v-slot:footerButtons>
      <div id="topicsModalFooterButtons"></div>
    </template>
  </modal>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { Course } from '@/interfaces'
import { createCourse, getCourses } from '@/api/courses'
import CourseListItem from '@/components/CourseListItem.vue'
import UIButton from '@/components/UIButton.vue'
import Modal from '@/components/Modal.vue'
import CourseEditor from '@/components/CourseEditor.vue'
import Skeleton from '@/components/Skeleton.vue'

export default defineComponent({
  components: { CourseListItem, UIButton, Modal, CourseEditor, Skeleton },
  name: 'TeacherDashboard',
  async created () {
    this.loading = true
    this.courses = await getCourses()
    this.loading = false
  },
  data () {
    return {
      courses: [] as Course[],
      loading: false,
      showCourseCreation: false,
      draftCourse: {
        name: '',
        allowed_teachers: [] as string[]
      } as Course
    }
  },
  methods: {
    async _createCourse () {
      const response = await createCourse(this.draftCourse)
      this.courses.push(response)
      this.showCourseCreation = false
      this.draftCourse = {} as Course
      this.$store.commit('pushNotification', {
        message: 'Corso creato con successo',
        autoHide: 2000,
        severity: 1
      })
      this.$router.push(`/course-panel/${response.id}`)
    },
    updateDraftCourse (newVal: string) {
      this.draftCourse = JSON.parse(newVal)
    }
  }
})
</script>

<style></style>
