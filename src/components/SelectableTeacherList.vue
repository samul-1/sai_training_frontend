<template>
  <Skeleton v-if="loading"></Skeleton>
  <div
    v-for="teacher in teachers"
    :key="'teacher-' + teacher.id"
    class="flex my-2 space-x-2"
  >
    <p>{{ teacher.full_name }}</p>
    <UIButton
      @click="toggle(teacher.id)"
      v-if="
        (course.id && teacher.id != course.creator_id) ||
          (!course.id && teacher.id != $store.state.user.id)
      "
      :size="'xs'"
      :variant="course.allowed_teachers.includes(teacher.id) ? 'red' : 'green'"
      >{{
        course.allowed_teachers.includes(teacher.id) ? 'Rimuovi' : 'Aggiungi'
      }}</UIButton
    >
    <div class="italic text-gray-400" v-else>(creatore del corso)</div>
  </div>
</template>

<script lang="ts">
import { Course, User } from '@/interfaces'
import { defineComponent, PropType } from '@vue/runtime-core'
import { getTeachers, updateAllowedTeachers } from '@/api/users'
import Skeleton from '@/components/Skeleton.vue'
import UIButton from './UIButton.vue'

export default defineComponent({
  name: 'SelectableTeacherList',
  components: {
    Skeleton,
    UIButton
  },
  props: {
    modelValue: {
      type: Array as PropType<string[]>,
      required: true
    },
    course: {
      type: Object as PropType<Course>,
      required: true
    },
    buttonsDisabled: {
      type: Boolean,
      default: false
    }
  },
  async created () {
    this.loading = true
    this.selectedTeachers = [...this.modelValue]
    this.teachers = await getTeachers()
    this.loading = false
  },
  data () {
    return {
      loading: false,
      selectedTeachers: [] as string[],
      teachers: [] as User[]
    }
  },
  watch: {
    teachersAsJSON (newVal) {
      this.$emit('update:modelValue', JSON.parse(newVal))
    }
  },
  methods: {
    toggle (id: string): void {
      if (this.selectedTeachers.includes(id)) {
        this.selectedTeachers.splice(this.selectedTeachers.indexOf(id), 1)
      } else {
        this.selectedTeachers.push(id)
      }
    }
  },
  computed: {
    teachersAsJSON (): string {
      return JSON.stringify(this.selectedTeachers)
    }
  }
})
</script>

<style></style>
