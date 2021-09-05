<template>
  <VueEditor v-model="content" :editorToolbar="customToolbar"></VueEditor>
</template>

<script lang="ts">
import { defineComponent } from '@vue/runtime-core'
import { PropType } from 'vue'
import { VueEditor } from 'vue3-editor'

export default defineComponent({
  name: 'RichEditor',
  components: {
    VueEditor
  },
  created () {
    this.content = this.modelValue
  },
  props: {
    modelValue: {
      type: String as PropType<string>,
      required: true
    }
  },
  watch: {
    processedContent (newVal) {
      this.$emit('update:modelValue', newVal)
    },
    modelValue (newVal) {
      this.content = newVal
    }
  },
  data () {
    return {
      content: '',
      customToolbar: [
        ['bold', 'italic', 'underline'],
        // [{ list: 'ordered' }, { list: 'bullet' }],
        ['image'] // 'code-block'
      ]
    }
  },
  computed: {
    processedContent (): string {
      return this.content
    }
  }
})
</script>

<style></style>
