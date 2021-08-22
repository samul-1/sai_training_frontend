<template>
  <!-- <h1 class="mb-8 text-4xl text-center">Argomenti</h1> -->
  <div class="grid md:grid-cols-2">
    <div
      v-for="topic in topics"
      :key="'topic-' + topic.id"
      class="flex my-3 space-x-2"
    >
      <p v-if="editing != topic.id" class="mb-auto">{{ topic.name }}</p>
      <div class="flex flex-col" v-else>
        <input
          :class="{
            'bg-red-200 border-0 text-red-900': isDuplicated(topic)
          }"
          class="border rounded-md p px-1.5"
          type="text"
          v-model="topics.find(t => t.id == topic.id).name"
        />
        <h1 class="mt-2 font-medium">Testo di aiuto</h1>
        <textarea
          cols="1"
          rows="4"
          class="p-1 border rounded-lg"
          v-model="topics.find(t => t.id == topic.id).help_text"
          placeholder="Questo testo verrà mostrato agli studenti che sbagliano più del 50% delle domande di questo argomento."
        ></textarea>
      </div>
      <UIButton
        v-if="editing != topic.id"
        :variant="'light'"
        :size="'xs'"
        @click="editTopic(topic)"
        :disabled="editing && editing != topic.id"
        class="mb-auto"
        ><i class="text-xs fas fa-edit"></i
      ></UIButton>
      <div class="flex mb-auto space-x-2" v-else>
        <UIButton
          @click="topic.id == '_' ? _createTopic(topic) : _updateTopic(topic)"
          :variant="'green'"
          :size="'xs'"
          :disabled="isDuplicated(topic) || !topic.name.length"
          >Salva</UIButton
        >
        <UIButton @click="rollBack()" :variant="'dark'" :size="'xs'"
          >Annulla</UIButton
        >
      </div>
    </div>
  </div>
  <teleport v-if="!loading" :to="'#topicsModalFooterButtons'">
    <UIButton
      class="my-auto"
      :variant="'green'"
      :size="'sm'"
      @click="newTopic()"
      :disabled="editing"
      ><span>Nuovo argomento</span></UIButton
    ></teleport
  >
</template>

<script lang="ts">
import { createTopic, getTopics, updateTopic } from '@/api/courses'
import { Topic } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import UIButton from './UIButton.vue'

export default defineComponent({
  components: { UIButton },
  name: 'CourseTopicList',
  async created () {
    this.loading = true
    this.topics = await getTopics(this.courseId)
    this.loading = false
  },
  props: {
    courseId: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      topics: [] as Topic[],
      editing: null as string | null,
      editedBeforeState: {} as Topic,
      loading: false
    }
  },
  methods: {
    editTopic (topic: Topic) {
      this.editing = topic.id as string
      this.editedBeforeState = { ...topic }
    },
    rollBack (): void {
      const target = this.topics.findIndex(
        t => t.id === this.editedBeforeState.id
      )
      if (this.editing == '_') {
        this.topics.pop()
      } else {
        this.topics[target] = { ...this.editedBeforeState } as Topic
      }
      this.editedBeforeState = {} as Topic
      this.editing = null
    },
    async _updateTopic (topic: Topic): Promise<void> {
      //const courseId = this.$route.params.courseId as string
      const response = await updateTopic(
        this.courseId,
        topic.id as string,
        topic
      )
      topic = { ...response }
      this.editing = null
    },
    async _createTopic (topic: Topic): Promise<void> {
      //const courseId = this.$route.params.courseId as string
      const { id, ...rest } = topic // throw away the dummy id
      const response = await createTopic(this.courseId, rest)
      this.topics.pop()
      this.topics.push({ ...response })
      this.editing = null
    },
    newTopic (): void {
      this.topics.push({
        id: '_',
        name: ''
      })
      this.editing = '_'
    },
    isDuplicated (topic: Topic): boolean {
      return this.topics.some(t => {
        return t.name == topic.name && t.id != topic.id
      })
    }
  }
})
</script>

<style></style>
