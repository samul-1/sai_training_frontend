<template>
  <div>
    <h1 class="mb-2 text-lg font-medium">Nome del corso</h1>
    <textarea
      rows="1"
      cols="70"
      class="p-3 border rounded-lg"
      v-model="course.name"
    ></textarea>

    <h1 class="mt-4 mb-2 text-lg font-medium">Descrizione (opzionale)</h1>
    <textarea
      rows="2"
      cols="70"
      class="p-3 border rounded-lg"
      v-model="course.description"
    ></textarea>

    <h1 class="mt-4 mb-2 text-lg font-medium">Insegnanti del corso</h1>
    <SelectableTeacherList
      v-model="course.allowed_teachers"
      :course="course"
    ></SelectableTeacherList>
  </div>
</template>

<script lang="ts">
import { Course } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import SelectableTeacherList from '@/components/SelectableTeacherList.vue'

export default defineComponent({
  name: 'CourseEditor',
  components: { SelectableTeacherList },
  watch: {
    courseAsJSON (newVal) {
      this.$emit('update', newVal)
    }
  },
  data () {
    return {
      course: {
        name: '',
        description: '',
        allowed_teachers: [] as string[]
      } as Course
    }
  },
  computed: {
    courseAsJSON (): string {
      return JSON.stringify(this.course)
    }
  }
})
</script>

<style></style>
