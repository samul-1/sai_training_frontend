<template>
  <h1 class="mb-8 text-4xl text-center">Corsi</h1>
  <course-list-item
    v-for="course in courses"
    :key="'course-' + course.id"
    :course="course"
  >
  </course-list-item>
</template>

<script lang="ts">
import { getCourses } from '@/api/courses'
import { defineComponent } from 'vue'
import { Course } from '@/interfaces'
import CourseListItem from '@/components/CourseListItem.vue'

export default defineComponent({
  components: { CourseListItem },
  name: 'Courses',
  data () {
    return {
      courses: [] as Array<Course>
    }
  },
  async created (): Promise<void> {
    this.courses = await getCourses()
  }
})
</script>

<style></style>
