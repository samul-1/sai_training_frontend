<template>
  <h1 class="mb-8 text-4xl text-center">Corsi</h1>
  <!-- <Skeleton v-if="loading"></Skeleton> -->
  <course-list-item
    v-for="course in courses"
    :key="'course-' + course.id"
    :course="course"
  >
  </course-list-item>
  <p class="mt-4" v-if="!loading && !courses.length">
    Al momento non ci sono corsi disponibili. Attendi che i tuoi docenti li
    creino.
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
