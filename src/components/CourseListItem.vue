<template>
  <div class="p-4 my-4 border rounded-md md:flex hover:shadow-inner">
    <div>
      <p class="text-xl font-medium">
        {{ course.name }}
        <span class="ml-3 text-sm text-green-700" v-if="course.enrolled">
          <i class="fas fa-certificate"></i> Iscritto</span
        >
      </p>
      <p
        v-if="course.description.length"
        v-html="course.description"
        class="mt-2"
      ></p>
      <div class="mt-4 text-sm font-light">
        <p>
          <i class="mr-1 text-xs text-indigo-900 fas fa-user-shield"></i
          ><span class="font-medium">Docente:</span> {{ course.creator }}
        </p>
        <p>
          <i class="mr-1 text-xs text-indigo-900 fas fa-user-friends"></i>
          <span class="font-medium">Iscritti:</span>
          {{ course.number_enrolled }}
        </p>
      </div>
    </div>
    <div class="mt-4 mb-auto ml-auto text-center md:mt-auto">
      <router-link
        v-if="!$store.state.user.is_teacher"
        :to="'/course/' + course.id"
      >
        <UIButton :variant="course.enrolled ? 'indigo' : 'green'">
          <!-- <i
            :class="{
              'fas fa-plus-circle mr-1': !course.enrolled,
              'fas fa-arrow-right mr-1': course.enrolled
            }"
          ></i> -->
          {{ course.enrolled ? 'Vai al corso' : 'Iscriviti' }}
        </UIButton></router-link
      >
      <router-link v-else :to="'/course-panel/' + course.id">
        <UIButton :variant="'green'">
          <!-- <i
            :class="{
              'fas fa-plus-circle mr-1': !course.enrolled,
              'fas fa-arrow-right mr-1': course.enrolled
            }"
          ></i> -->
          Pannello di controllo
        </UIButton></router-link
      >
    </div>
  </div>
</template>

<script lang="ts">
import { Course } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import UIButton from './UIButton.vue'

export default defineComponent({
  components: { UIButton },
  name: 'CourseListItem',
  props: {
    course: {
      type: Object as PropType<Course>,
      required: true
    }
  }
})
</script>

<style></style>
