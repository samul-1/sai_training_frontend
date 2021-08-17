<template>
  <button
    class="shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="disabled"
    :class="{
      'py px-2 text-sm rounded-md': size == 'xs',
      'py-1.5 px-4 rounded-md': size == 'sm',
      'py-1.5 px-6 rounded-lg': size == 'md',
      'py-3 px-16 text-xl rounded-xl': size == 'lg',
      'py-6 px-28 text-2xl rounded-xl': size == 'xl',
      'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white':
        variant == 'green',
      'bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white':
        variant == 'indigo',
      'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white':
        variant == 'red'
    }"
  >
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'UIButton',
  props: {
    variant: {
      type: String,
      default: 'indigo'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: 'md'
    }
  }
}
</script>

<style></style>
