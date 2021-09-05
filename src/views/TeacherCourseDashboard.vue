<template>
  <div v-if="loading">
    <Skeleton class="ml-60" :singleLine="true"></Skeleton>
  </div>
  <h1 class="mb-8 text-4xl text-center">{{ course.name }}</h1>
  <!-- <p v-if="course.description.length" v-html="course.description"></p> -->
  <div class="flex flex-col w-full mx-auto space-y-6 md:w-max">
    <router-link :to="`/course-panel/${$route.params.courseId}/questions`"
      ><UIButton :variant="'indigo'" :size="'lg'" class="w-full">
        Domande
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
    <router-link :to="`/course-panel/${$route.params.courseId}/templates`">
      <UIButton :variant="'indigo'" :size="'lg'" class="w-full"
        >Modelli esercitazioni
      </UIButton></router-link
    >
  </div>
  <router-view></router-view>
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
  computed: {
    allowedTeachersAsJSON (): string {
      return JSON.stringify(this.course.allowed_teachers)
    }
  }
})
</script>

<style></style>
