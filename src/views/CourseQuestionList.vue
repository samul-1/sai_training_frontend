<template>
  <teleport to="#nav-buttons">
    <router-link :to="`/course-panel/${$route.params.courseId}`">
      <UIButton :variant="'transparent'" :size="'xs'"
        ><i class="mr-1 text-xs fas fa-chevron-left"></i>Torna al pannello del
        corso</UIButton
      ></router-link
    >
  </teleport>
  <h1 class="mb-8 text-4xl text-center">Domande</h1>
  <div class="flex flex-col my-12 md:flex-row">
    <p class="my-auto mr-8 font-medium">Filtra per</p>
    <div class="flex my-auto mr-8 space-x-2">
      <input
        class="my-auto min-w-15px"
        type="checkbox"
        v-model="filter.byTopic"
        id="filter-by-topic"
      />
      <label for="filter-by-topic">Argomento</label>
      <p>
        <select
          v-model="filter.topic"
          class="col-span-4 p-0.5 bg-white border rounded-md"
        >
          <option :value="''" selected disabled class="text-red-900">
            Seleziona un argomento
          </option>
          <option
            class="text-black bg-white"
            v-for="topic in topics"
            :key="'filter-topic-' + topic.id"
            :value="topic.id"
          >
            {{ topic.name }}
          </option>
        </select>
      </p>
    </div>
    <div class="flex my-auto mt-2 md:mt-0">
      <input
        class="my-auto mr-2 min-w-15px"
        type="checkbox"
        id="filter-by-difficulty"
        v-model="filter.byDifficulty"
      />
      <label for="filter-by-difficulty" class="mr-8">Difficoltà</label>
      <difficulty-input
        class="w-80"
        v-model="filter.difficulty"
      ></difficulty-input>
    </div>
  </div>
  <div class="flex flex-col space-y-2 md:flex-row md:space-y-0">
    <router-link
      class="md:ml-auto"
      :to="`/course-panel/${$route.params.courseId}/import`"
      ><UIButton :variant="'negative'" class="w-full md:w-max">
        Importa da JSON
      </UIButton></router-link
    >
    <UIButton
      :variant="'negative'"
      class="md:ml-2"
      @click="showExportPanel = true"
    >
      Esporta come JSON
    </UIButton>
    <UIButton
      class="md:ml-2"
      :disabled="showDraft"
      @click="showDraft = true"
      :variant="'green'"
      >Nuova domanda</UIButton
    >
  </div>

  <Skeleton v-if="firstLoading"></Skeleton>
  <Spinner v-if="loading"></Spinner>

  <transition name="bounce">
    <QuestionEditor
      class="my-4"
      v-if="showDraft"
      v-model="draftQuestion"
      :startCollapsed="false"
      :topicChoices="topics"
      :showSave="true"
      @updateTopics="updateTopics()"
      @save="saveQuestion(draftQuestion)"
      @delete="showDraft = false"
    ></QuestionEditor
  ></transition>

  <QuestionEditor
    class="my-4 even:bg-gray-50"
    v-for="(question, index) in questions"
    :key="'q-' + question.id"
    v-model="questions[index]"
    :startCollapsed="true"
    :topicChoices="topics"
    :showSave="true"
    :ref="'question-editor-' + question.id"
    @updateTopics="updateTopics()"
    @save="saveQuestion(question)"
    @delete="deletingId = question.id"
  ></QuestionEditor>

  <div class="mt-6 text-center">
    <p
      @click="currentPage = currentPage + 1"
      class="text-gray-600 underline cursor-pointer hover:text-gray-800"
    >
      Carica più domande
    </p>
  </div>

  <modal
    v-if="showExportPanel"
    :title="'Scegli argomento'"
    :confirmOnly="true"
    :dismissible="true"
    @yes="showExportPanel = false"
    ><template v-slot:body>
      <div class="grid grid-cols-2">
        <div
          class="flex my-2 space-x-2"
          v-for="topic in topics"
          :key="'export-t-' + topic.id"
        >
          <p>{{ topic.name }}</p>
          <UIButton
            :variant="'light'"
            :size="'2xs'"
            @click="downloadQuestions(topic.id)"
            ><i class="opacity-80 fas fa-download"></i
          ></UIButton>
        </div>
      </div> </template
  ></modal>
  <modal
    v-if="deletingId"
    :title="'Conferma eliminazione'"
    :dismissible="true"
    :yesCooldown="5"
    :large="true"
    :severity="2"
    @yes="_deleteQuestion(deletingId)"
    @no="deletingId = null"
    ><template v-slot:body>
      Stai per eliminare questa domanda:
      <FullQuestion
        :showIcon="false"
        :question="deletingQuestion"
      ></FullQuestion>
      Confermi di volerla eliminare? Quest'azione è irreversibile.</template
    ></modal
  >
</template>

<script lang="ts">
import { getTopics } from "@/api/courses";
import {
  createQuestion,
  deleteQuestion,
  getQuestions,
  updateQuestion,
} from "@/api/items";
import DifficultyInput from "@/components/DifficultyInput.vue";
import QuestionEditor from "@/components/QuestionEditor.vue";
import UIButton from "@/components/UIButton.vue";
import Skeleton from "@/components/Skeleton.vue";
import { Choice, Question, Topic } from "@/interfaces";
import { defineComponent } from "@vue/runtime-core";
import Spinner from "@/components/Spinner.vue";
import Modal from "@/components/Modal.vue";
import { downloadObjectAsJson, renderTex } from "@/utils";
import FullQuestion from "@/components/FullQuestion.vue";

export default defineComponent({
  components: {
    Skeleton,
    QuestionEditor,
    DifficultyInput,
    UIButton,
    Spinner,
    Modal,
    FullQuestion,
  },
  name: "CourseQuestionList",
  async created() {
    window.addEventListener("beforeunload", this.beforeWindowUnload);

    const courseId = this.$route.params.courseId as string;
    this.firstLoading = true;
    this.questions = await getQuestions(courseId, null, null, 1);
    this.topics = await getTopics(courseId);
    this.firstLoading = false;
  },
  beforeUnmount() {
    window.removeEventListener("beforeunload", this.beforeWindowUnload);
  },
  beforeRouteLeave(_to, _from, next) {
    if (this.confirmStayInDirtyForm()) {
      next(false);
    } else {
      next();
    }
  },
  watch: {
    filterAsJSON: {
      async handler(_newVal, _oldVal) {
        console.log("firing");
        const newVal = JSON.parse(_newVal);
        const oldVal = JSON.parse(_oldVal);
        if (
          (newVal.topic != oldVal.topic && !newVal.byTopic) ||
          (newVal.difficulty != oldVal.difficulty && !newVal.byDifficulty)
        ) {
          return;
        }
        this.currentPage = 1;
        await this.reloadQuestions(true);
      },
    },
    async currentPage(_newVal) {
      await this.reloadQuestions(false);
    },
    deletingId(newVal: number | null) {
      if (newVal) {
        setTimeout(() => renderTex(), 1000);
      }
    },
  },
  data() {
    return {
      currentPage: 1,
      questions: [] as Question[],
      filter: {
        difficulty: "2",
        topic: "",
        byDifficulty: false,
        byTopic: false,
      },
      topics: [] as Topic[],
      loading: false,
      firstLoading: false,
      showDraft: false,
      showExportPanel: false,
      draftQuestion: {
        id: "_",
        text: "",
        topic: "",
        solution: "",
        difficulty: "2",
        choices: [] as Choice[],
        is_open_ended: false,
      } as Question,
      deletingId: null as string | null,
    };
  },
  methods: {
    confirmLeave() {
      return window.confirm(
        "Hai effettuato delle modifiche che non hai salvato. Sei sicuro di voler uscire dalla pagina?"
      );
    },
    confirmStayInDirtyForm() {
      return this.dirty && !this.confirmLeave();
    },
    beforeWindowUnload(e: { preventDefault: () => void; returnValue: string }) {
      if (this.confirmStayInDirtyForm()) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = "";
      }
    },
    async updateTopics() {
      const courseId = this.$route.params.courseId as string;
      this.topics = await getTopics(courseId);
    },
    async reloadQuestions(overwrite: boolean): Promise<void> {
      const courseId = this.$route.params.courseId as string;
      try {
        this.loading = true;
        const response = await getQuestions(
          courseId,
          this.filter.byTopic ? this.filter.topic : null,
          this.filter.byDifficulty ? this.filter.difficulty : null,
          this.currentPage
        );
        if (overwrite) {
          this.questions = response;
        } else {
          this.questions = [...this.questions, ...response];
        }
      } finally {
        this.loading = false;
      }
    },
    async _deleteQuestion(questionId: string): Promise<void> {
      const courseId = this.$route.params.courseId as string;
      this.loading = true;
      try {
        await deleteQuestion(courseId, questionId);
        this.questions.splice(
          this.questions.findIndex((q) => q.id === questionId),
          1
        );
        this.$store.commit("pushNotification", {
          message: "Domanda eliminata con successo",
          severity: 1,
          autoHide: 2000,
        });
      } finally {
        this.loading = false;
        this.deletingId = null;
      }
    },
    async saveQuestion(question: Question): Promise<void> {
      const courseId = this.$route.params.courseId as string;
      this.loading = true;

      try {
        if (question.id != "_") {
          const response = await updateQuestion(courseId, question);
          this.questions[
            this.questions.findIndex((q) => question.id === q.id)
          ] = response;

          // remove the "unsaved changes" warning from editor and collapse it
          (
            this.$refs["question-editor-" + question.id] as {
              dirty: boolean;
            }
          ).dirty = false;
          (
            this.$refs["question-editor-" + question.id] as {
              collapse: boolean;
            }
          ).collapse = true;
          this.$store.commit("pushNotification", {
            message: "Domanda aggiornata con successo",
            autoHide: 1500,
            severity: 1,
          });
        } else {
          const response = await createQuestion(courseId, question);
          this.questions.unshift(response);
          this.draftQuestion = {
            id: "_",
            text: "",
            topic: "",
            solution: "",
            difficulty: "2",
            choices: [] as Choice[],
            is_open_ended: false,
          } as Question;
          this.$store.commit("pushNotification", {
            message: "Domanda creata con successo",
            autoHide: 1500,
            severity: 1,
          });
          this.showDraft = false;
        }
      } finally {
        this.loading = false;
      }
    },
    async downloadQuestions(topicId: string): Promise<void> {
      const courseId = this.$route.params.courseId as string;
      this.loading = true;
      const questions = await getQuestions(courseId, topicId, null, -1, true);
      this.loading = false;
      downloadObjectAsJson(
        questions,
        `${this.topics.find((t) => t.id === topicId)?.name}.json`
      );
    },
  },
  computed: {
    filterAsJSON(): string {
      return JSON.stringify(this.filter);
    },
    dirty(): boolean {
      // returns true if any of the question editors are dirty
      return this.questions
        .map((q) => {
          return (this.$refs["question-editor-" + q.id] as { dirty: boolean })
            .dirty;
        })
        .reduce((a, b) => a || b, false);
    },
    deletingQuestion(): Question | undefined {
      if (!this.deletingId) {
        return;
      }
      return this.questions.find((q) => q.id === this.deletingId);
    },
  },
});
</script>

<style>
.min-w-15px {
  min-width: 15px;
}
</style>
