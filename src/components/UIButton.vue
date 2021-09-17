<template>
  <button
    class="transition-colors duration-150 shadow-sm disabled:cursor-not-allowed disabled:opacity-60"
    :disabled="disabled"
    :class="{
      'py-0.5 px-1.5 text-sm rounded-lg': size == '2xs',
      'py-1 px-2 text-sm rounded-lg': size == 'xs',
      'py-1.5 px-4 rounded-lg': size == 'sm',
      'py-1.5 px-6 rounded-lg': size == 'md',
      'py-3 px-12 md:px-24 w-full text-lg rounded-xl': size == 'lg',
      'py-6 px-20 md:px-32 text-xl rounded-2xl': size == 'xl',
      'bg-green-600 hover:bg-green-700 active:bg-green-800 text-white':
        variant == 'green',
      'bg-indigo-700 hover:bg-indigo-800 active:bg-indigo-900 text-white':
        variant == 'indigo',
      'bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white':
        variant == 'dark',
      'bg-gray-100 border border-gray-200 hover:bg-gray-200 hover:shadow-inner active:bg-gray-300 text-black':
        variant == 'light',
      'bg-red-700 hover:bg-red-800 active:bg-red-900 text-white':
        variant == 'red',
      ' hover:bg-white hover:text-black border border-white text-white active:bg-gray-200':
        variant == 'transparent',
      ' hover:bg-gray-900 hover:text-white border border-gray-900 text-black active:bg-gray-800':
        variant == 'negative',
      ' hover:bg-red-900 hover:text-white border border-red-700 text-red-900 active:bg-red-800':
        variant == 'negative-red'
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
