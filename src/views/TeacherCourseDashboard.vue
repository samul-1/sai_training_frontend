<template>
  <teleport to="#nav-buttons">
    <router-link to="/teacher/">
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
    <div class="relative w-full">
      <h1 class="-mb-2 text-4xl text-center">{{ course.name }}</h1>
      <div class="absolute left-0 right-0 mx-auto mt-4 w-max md:mt-8 md:w-max">
        <p class="md:inline">
          <i class="mr-1 text-sm fas fa-link opacity-70"></i> Link al corso per
          gli studenti:
        </p>
        <p
          class="inline text-blue-700 cursor-pointer hover:underline"
          v-clipboard:copy="linkToCourse"
          v-clipboard:success="onCopy"
        >
          {{ linkToCourse }}
        </p>
        <UIButton
          v-clipboard:copy="linkToCourse"
          v-clipboard:success="onCopy"
          class="ml-1 md:ml-2"
          :size="'xs'"
          :variant="'indigo'"
          >Copia</UIButton
        >
      </div>
    </div>

    <!-- <p v-if="course.description.length" v-html="course.description"></p> -->
    <div
      class="relative flex flex-col w-full mx-auto space-y-6 transform -translate-y-1/2 top-1/2 md:w-max"
    >
      <router-link
        :to="
          `/course-panel/${$route.params.courseId}/${
            course.uses_programming_exercises
              ? 'programming_exercises'
              : 'questions'
          }`
        "
        ><UIButton :variant="'indigo'" :size="'lg'" class="w-full">
          {{ course.uses_programming_exercises ? 'Esercizi JS' : 'Domande' }}
        </UIButton></router-link
      >
      <UIButton
        :variant="'indigo'"
        :size="'lg'"
        class="w-full"
        @click="showTopics = true"
        >Argomenti
      </UIButton>
      <UIButton
        :variant="'indigo'"
        :size="'lg'"
        class="w-full"
        @click="showAllowedTeachers = true"
        >Gestisci insegnanti
      </UIButton>
      <router-link
        v-if="!course.uses_programming_exercises"
        :to="`/course-panel/${$route.params.courseId}/templates`"
      >
        <UIButton :variant="'indigo'" :size="'lg'" class="w-full"
          >Modelli esercitazioni
        </UIButton></router-link
      >
    </div>
  </div>
  <modal
    :large="true"
    v-if="showTopics"
    @yes="showTopics = false"
    :confirmOnly="true"
    :dismissible="true"
    :title="'Argomenti ' + course.name"
  >
    <template v-slot:body
      ><CourseTopicList :courseId="$route.params.courseId"></CourseTopicList
    ></template>
    <template v-slot:footerButtons>
      <div id="topicsModalFooterButtons"></div>
    </template>
  </modal>

  <modal
    :large="true"
    v-if="showAllowedTeachers"
    @yes="showAllowedTeachers = false"
    :confirmOnly="true"
    :dismissible="true"
    :title="'Insegnanti autorizzati per ' + course.name"
  >
    <template v-slot:body
      ><SelectableTeacherList
        v-model="course.allowed_teachers"
        :course="course"
        :buttonsDisabled="loading"
      ></SelectableTeacherList
    ></template>
    <template v-slot:footerButtons>
      <div id="topicsModalFooterButtons"></div>
    </template>
  </modal>
</template>

<script lang="ts">
import { getCourse } from '@/api/courses'
import CourseTopicList from '@/components/CourseTopicList.vue'
import Modal from '@/components/Modal.vue'
import UIButton from '@/components/UIButton.vue'
import { Course } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import SelectableTeacherList from '@/components/SelectableTeacherList.vue'
import { updateAllowedTeachers } from '@/api/users'
import Skeleton from '@/components/Skeleton.vue'

export default defineComponent({
  components: {
    UIButton,
    Modal,
    CourseTopicList,
    SelectableTeacherList,
    Skeleton
  },
  name: 'TeacherCourseDashboard',
  async created () {
    this.loading = true
    const courseId = this.$route.params.courseId as string
    try {
      this.course = await getCourse(courseId)
      this.loading = false
    } catch (error) {
      this.$router.push('/teacher')
    }
  },
  watch: {
    async allowedTeachersAsJSON (_newVal) {
      const newVal = JSON.parse(_newVal)
      const courseId = this.$route.params.courseId as string

      //this.loading = true
      await updateAllowedTeachers(courseId, newVal)
      //this.loading = false
    }
  },
  data () {
    return {
      course: {} as Course,
      showTopics: false,
      showAllowedTeachers: false,
      loading: false
    }
  },
  methods: {
    onCopy () {
      this.$store.commit('pushNotification', {
        message: 'Link copiato',
        severity: 1,
        autoHide: 1000
      })
    }
  },
  computed: {
    allowedTeachersAsJSON (): string {
      return JSON.stringify(this.course.allowed_teachers)
    },
    linkToCourse (): string {
      return `${window.location.protocol}//${window.location.host}/course/${this
        .$route.params.courseId as string}`
    }
  }
})
</script>

<style></style>
