<template>
  <h1 class="mb-8 text-4xl text-center">Corsi</h1>
  <!-- <Skeleton v-if="loading"></Skeleton> -->
  <div class="flex mb-8 space-x-2">
    <p class="my-auto">
      <i class="mr-1 fas fa-search"></i>Cerca
      <span class="hidden md:inline">corsi</span>
    </p>
    <input
      type="text"
      v-model="searchText"
      class="w-4/5 px-2 py-1 border border-gray-200 rounded-md md:w-96"
      placeholder="Cerca per nome del corso o docente"
    />
  </div>
  <course-list-item
    v-for="course in filteredCourses"
    :key="'course-' + course.id"
    :course="course"
  >
  </course-list-item>
  <p class="mt-4" v-if="!loading && !courses.length">
    Al momento non ci sono corsi disponibili. Attendi che i tuoi docenti li
    creino.
  </p>
  <p class="mt-4" v-if="!loading && courses.length && !filteredCourses.length">
    Nessun corso corrisponde ai parametri di ricerca.
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
      courses: [] as Course[],
      loading: false,
      searchText: ''
    }
  },
  async created (): Promise<void> {
    this.loading = true
    this.courses = await getCourses()
    this.loading = false
  },
  computed: {
    filteredCourses (): Course[] {
      // if (!this.searchText.length) {
      //   return this.courses
      // }
      return this.courses.filter(c => {
        return (c.name + c.creator.toLowerCase())
          .toLowerCase()
          .includes(this.searchText.toLowerCase())
      })
    }
  }
})
</script>

<style></style>
