<template>
  <h1 class="mb-8 text-4xl text-center">{{ course.name }}</h1>
  <p v-if="course.description.length" v-html="course.description"></p>
  <div class="flex flex-col mx-auto space-y-6 w-max">
    <router-link :to="`/course/${$route.params.courseId}/train/`"
      ><UIButton :variant="'indigo'" :size="'xl'" class="w-full"
        >Inizia esercitazione</UIButton
      ></router-link
    >
    <router-link :to="`/course/${$route.params.courseId}/sessions/`">
      <UIButton :variant="'indigo'" :size="'xl'" class="w-full"
        >Cronologia eserciazioni</UIButton
      ></router-link
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
