<template>
  <h1 class="mb-8 text-4xl text-center">{{ course.name }}</h1>
  <p v-if="course.description.length" v-html="course.description"></p>
  <div class="mx-auto space-x-6 text-center">
    <router-link to="courses"
      ><UIButton :variant="'indigo'" :size="'xl'"
        >Inizia esercitazione</UIButton
      ></router-link
    >
    <UIButton :variant="'indigo'" :size="'xl'"
      >Cronologia eserciazioni</UIButton
    >
  </div>
</template>

<script lang="ts">
import { getCourse } from '@/api/courses'
import UIButton from '@/components/UIButton.vue'
import { Course } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'

export default defineComponent({
  components: { UIButton },
  name: 'StudentCourseDashboard',
  async created () {
    const courseId = this.$route.params.courseId as string
    this.course = await getCourse(courseId)
  },
  data () {
    return {
      course: {} as Course
    }
  }
})
</script>

<style></style>
