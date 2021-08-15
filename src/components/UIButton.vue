<template>
  <button class="py-2 px-10 bg-green-500 text-white rounded-lg shadow-sm">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'UIButton',
  methods: {
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    handleClick () {
      console.log('clicked')
    }
  }
}
</script>

<style></style>
