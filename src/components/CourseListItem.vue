<template>
  <div class="p-4 mx-3 my-2 border rounded-lg md:flex hover:shadow-inner">
    <div>
      <p class="text-xl font-medium">
        {{ course.name }}
        <span class="ml-3 text-sm text-green-700" v-if="course.enrolled">
          <i class="fas fa-certificate"></i> Iscritto</span
        >
      </p>
      <p v-if="course.description.length" class="mt-2">
        {{ course.description }}
      </p>
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
    <div class="my-auto ml-auto text-center">
      <UIButton :variant="course.enrolled ? 'indigo' : 'green'">
        <i
          :class="{
            'fas fa-plus-circle mr-1': !course.enrolled,
            'fas fa-arrow-right mr-1': course.enrolled
          }"
        ></i>
        {{ course.enrolled ? 'Vai al corso' : 'Iscriviti' }}
      </UIButton>
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
