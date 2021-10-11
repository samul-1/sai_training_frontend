<template>
  <!-- <h1 class="mb-8 text-4xl text-center">Argomenti</h1> -->
  <skeleton v-if="loading"></skeleton>
  <div class="grid md:grid-cols-2">
    <div
      v-for="topic in topics"
      :key="'topic-' + topic.id"
      class="flex my-3 space-x-2"
    >
      <p v-if="editing != topic.id" class="mb-auto">
        {{ topic.name }}
      </p>
      <div class="flex flex-col" v-else>
        <input
          :class="{
            'bg-red-200 border-0 text-red-900': isDuplicated(topic)
          }"
          class="border rounded-md p px-1.5"
          type="text"
          v-model="topics.find(t => t.id == topic.id).name"
          :placeholder="editing == '_' ? 'Nome del nuovo argomento' : ''"
        />
        <h1 class="mt-2 font-medium">Testo di aiuto (opzionale)</h1>
        <textarea
          cols="1"
          rows="4"
          class="p-1 border rounded-lg"
          v-model="topics.find(t => t.id == topic.id).help_text"
          placeholder="Questo testo verrà mostrato agli studenti che sbagliano più del 50% delle domande di questo argomento."
        ></textarea>
      </div>
      <div class="flex" v-if="editing != topic.id">
        <UIButton
          :variant="'light'"
          :size="'xs'"
          @click="editTopic(topic)"
          :disabled="editing && editing != topic.id"
          class="mb-auto"
          ><i class="text-xs fas fa-edit"></i
        ></UIButton>
        <UIButton
          @click="_deleteTopic(topic)"
          class="my-auto ml-2"
          :variant="'negative-red'"
          :size="'xs'"
          ><i class="fas fa-trash"></i
        ></UIButton>
        <i
          :class="{ 'opacity-100': success == topic.id }"
          class="ml-2 text-green-600 transition-opacity duration-200 opacity-0 fas fa-check"
        ></i>
        <p class="my-auto text-sm opacity-60">
          ({{ topic.items_count
          }}<span class="hidden md:inline"
            >&nbsp;domand{{ topic.items_count == 1 ? 'a' : 'e' }}</span
          >)
        </p>
      </div>
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
import { createTopic, deleteTopic, getTopics, updateTopic } from '@/api/courses'
import { Topic } from '@/interfaces'
import { defineComponent } from '@vue/runtime-core'
import UIButton from './UIButton.vue'
import Skeleton from '@/components/Skeleton.vue'

export default defineComponent({
  components: { UIButton, Skeleton },
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
      success: null as string | null,
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
    async _deleteTopic (topic: Topic): Promise<void> {
      if ((topic.items_count as number) > 0) {
        alert(
          `L'argomento ${topic.name} contiene ${topic.items_count} esercizi. Per poter cancellare un argomento, devi prima assicurarti che non contenga esercizi.`
        )
        return
      }
      if (
        confirm(
          `Sei sicuro di voler eliminare l'argomento ${topic.name}? Quest'azione è irreversibile.`
        )
      ) {
        await deleteTopic(this.courseId, topic.id as string)
      }
      this.topics = await getTopics(this.courseId)
    },
    async _updateTopic (topic: Topic): Promise<void> {
      //const courseId = this.$route.params.courseId as string
      const response = await updateTopic(
        this.courseId,
        topic.id as string,
        topic
      )
      topic = { ...response }
      this.success = topic.id as string
      setTimeout(() => {
        this.success = null
      }, 2000)
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
