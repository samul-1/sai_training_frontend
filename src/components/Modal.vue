<template>
  <transition name="fade" @after-enter="showContent = true" appear>
    <div
      class="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full"
    >
      <div
        @click="dismiss()"
        style="width: 100vw !important; height: 100vh !important"
        class="absolute z-10 w-full h-full transition-none bg-gray-900 opacity-80"
      ></div>
      <transition name="bounce" @after-leave="$emit(choice)">
        <div
          v-if="showContent"
          class="z-20 max-h-full overflow-y-auto w-full px-10 py-10 mx-1.5 bg-white rounded-lg shadow-lg md:mx-0"
          :class="{ 'md:w-3/5': !large, 'md:w-4/5': large }"
        >
          <div class="mb-10 text-black">
            <h1 v-html="title" class="mb-4 text-2xl"></h1>
            <!--<p v-html="subText" class="mt-4 text-md"></p>-->
            <slot name="body"></slot>
          </div>

          <div class="flex flex-col mt-5 md:flex-row">
            <div class="mt-auto"><slot name="footerButtons"></slot></div>
            <div class="flex mt-4 ml-auto md:mt-0">
              <UIButton
                class="mr-2"
                :disabled="disableOk"
                :variant="severity == 1 ? 'green' : 'red'"
                @click="chooseAndHide('yes')"
              >
                {{ confirmOnly ? 'Ok' : yesText || 'Sì' }}
              </UIButton>
              <UIButton
                :variant="'light'"
                @click="chooseAndHide('no')"
                v-if="!confirmOnly"
              >
                {{ noText || 'No' }}
              </UIButton>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import UIButton from '@/components/UIButton.vue'
export default defineComponent({
  name: 'Modal',
  props: {
    title: String,
    large: {
      type: Boolean,
      default: false
    },
    dismissible: Boolean,
    severity: {
      type: Number,
      default: 1
    },
    yesText: {
      type: String,
      default: ''
    },
    noText: {
      type: String,
      default: ''
    },
    confirmOnly: Boolean,
    disableOk: Boolean
  },
  components: { UIButton },
  data () {
    return {
      choice: '',
      showContent: false
    }
  },
  methods: {
    chooseAndHide (choice: string) {
      this.choice = choice
      this.showContent = false
    },
    dismiss () {
      if (!this.dismissible) return
      this.chooseAndHide(this.confirmOnly ? 'yes' : 'no')
    }
  }
})
</script>

<style></style>
