<template>
  <h1 class="mb-8 text-4xl text-center">{{ course.name }}</h1>
  <!-- <p v-if="course.description.length" v-html="course.description"></p> -->
  <div class="flex flex-col w-full mx-auto space-y-6 md:w-max">
    <router-link :to="`/course-panel/${$route.params.courseId}/import`"
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
    <UIButton :variant="'indigo'" :size="'lg'" class="w-full"
      >Gestisci insegnanti
    </UIButton>
    <UIButton :variant="'indigo'" :size="'lg'" class="w-full"
      >Modelli esercitazioni
    </UIButton>
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
</template>

<script lang="ts">
import { getCourse } from '@/api/courses'
import CourseTopicList from '@/components/CourseTopicList.vue'
import Modal from '@/components/Modal.vue'
import UIButton from '@/components/UIButton.vue'
import { Course } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  components: {
    UIButton,
    Modal,
    CourseTopicList
  },
  name: 'TeacherCourseDashboard',
  async created () {
    const courseId = this.$route.params.courseId as string
    this.course = await getCourse(courseId)
  },
  data () {
    return {
      course: {} as Course,
      showTopics: false
    }
  },
  methods: {}
})
</script>

<style></style>
