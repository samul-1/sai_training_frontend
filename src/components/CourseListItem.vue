<template>
  <div class="p-4 my-4 border rounded-md md:flex hover:shadow-inner">
    <div>
      <p class="text-xl font-medium">
        {{ course.name }}
        <span
          class="ml-3 text-sm text-green-700 whitespace-nowrap"
          v-if="course.enrolled"
        >
          <i class="fas fa-certificate"></i>&nbsp;Iscritto</span
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
          {{ course.enrolled ? 'Vai al corso' : 'Iscriviti' }}
        </UIButton></router-link
      >
      <div v-else>
        <UIButton
          class="my-auto mr-2"
          :variant="'dark'"
          :size="'sm'"
          v-if="!course.uses_programming_exercises"
          @click="showStats = true"
        >
          <i class="fas fa-chart-pie"></i>
        </UIButton>
        <router-link :to="'/course-panel/' + course.id">
          <UIButton :variant="'green'">
            Pannello di controllo
          </UIButton>
        </router-link>
      </div>
    </div>
  </div>
  <modal
    v-if="showStats"
    :confirmOnly="true"
    :dismissible="true"
    :title="'Statistiche corso ' + course.name"
    @yes="showStats = false"
  >
    <template v-slot:body>
      <CourseStats :courseId="course.id"></CourseStats></template
  ></modal>
</template>

<script lang="ts">
import { Course } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import Modal from './Modal.vue'
import UIButton from './UIButton.vue'
import CourseStats from '@/components/CourseStats.vue'
export default defineComponent({
  components: {
    UIButton,
    Modal,
    CourseStats
  },
  name: 'CourseListItem',
  props: {
    course: {
      type: Object as PropType<Course>,
      required: true
    }
  },
  data () {
    return {
      showStats: false
    }
  }
})
</script>

<style></style>
