<template>
  <div>
    <div class="animate-pulse">
      <div class="py-1 space-y-2">
        <div class="w-3/4 h-4 py-2 bg-gray-200 rounded"></div>
        <div class="space-y-2" v-if="!singleLine">
          <div
            v-if="!short"
            class="w-4/6 h-4 py-2 mt-2 mb-2 bg-gray-200 rounded"
          ></div>
          <div
            v-if="!short"
            class="w-2/4 h-4 py-2 mt-4 mb-8 bg-gray-200 rounded"
          ></div>
          <div
            v-if="!short"
            class="w-3/5 h-4 py-2 mt-4 bg-gray-200 rounded"
          ></div>
          <div class="w-4/6 h-4 py-2 mt-2 mb-2 bg-gray-200 rounded"></div>
          <div
            v-if="!short"
            class="w-3/5 h-4 py-2 mt-4 bg-gray-200 rounded"
          ></div>
          <div class="w-3/4 h-4 py-2 mt-4 mb-8 bg-gray-200 rounded"></div>
          <div class="w-4/6 h-4 py-2 mt-4 bg-gray-200 rounded"></div>
          <div class="w-3/4 h-4 py-2 mt-4 mb-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Skeleton',
  props: {
    singleLine: {
      type: Boolean,
      default: false
    },
    short: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style></style>
