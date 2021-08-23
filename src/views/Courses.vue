<template>
  <h1 class="mb-8 text-4xl text-center">Corsi</h1>
  <Skeleton v-if="loading"></Skeleton>
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
import Skeleton from '@/components/Skeleton.vue'

export default defineComponent({
  components: { CourseListItem, Skeleton },
  name: 'Courses',
  data () {
    return {
      courses: [] as Array<Course>,
      loading: false
    }
  },
  async created (): Promise<void> {
    this.loading = true
    this.courses = await getCourses()
    this.loading = false
  }
})
</script>

<style></style>
