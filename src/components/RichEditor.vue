<template>
  <div class="tex2jax_ignore">
    <VueEditor v-model="content" :editorToolbar="customToolbar"></VueEditor>
  </div>
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

<style>
.ql-toolbar.ql-snow {
  border: 1px solid rgb(229, 231, 235) !important;
  border-bottom: 0 !important;
  box-sizing: border-box;
  font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif;
  padding: 2px !important;
}
.ql-container.ql-snow {
  border: 1px solid rgb(229, 231, 235) !important;
}
.quillWrapper .ql-snow.ql-toolbar .ql-formats {
  margin-bottom: 2px !important;
}
.ql-snow.ql-toolbar button,
.ql-snow .ql-toolbar button {
  background: none;
  border: none;
  cursor: pointer;
  display: inline-block;
  float: left;
  height: 24px !important;
  padding: 3px 5px !important;
  width: 28px !important;
  margin-left: 1px !important;
  margin-right: 1px !important;
}
.quillWrapper .ql-snow.ql-toolbar {
  padding-top: 4px !important;
  padding-bottom: 2px !important;
  border-radius: 0.5rem 0.5rem 0 0 !important;
}
.ql-container {
  box-sizing: border-box;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 13px !important;
  height: 100%;
  margin: 0px;
  width: 100%;
  position: relative;
  border-radius: 0 0 0.5rem 0.5rem !important;
}
.ql-container:active,
.ql-container:hover {
  box-shadow: 1px 1px 5px rgba(126, 126, 126, 0.15) inset !important;
}
.ql-snow .ql-toolbar button svg,
.quillWrapper .ql-snow.ql-toolbar button svg {
  width: 18px !important;
  height: 18px !important;
}
.ql-editor {
  box-sizing: border-box;
  line-height: 1.42;
  height: 100%;
  outline: none;
  overflow-y: auto !important;
  padding: 12px 15px !important;
  -o-tab-size: 4;
  tab-size: 4;
  -moz-tab-size: 4;
  text-align: left;
  white-space: pre-wrap;
  word-wrap: break-word;
  min-height: 20px !important;
  max-height: 350px !important;
  font-size: 16px !important;
}
</style>
