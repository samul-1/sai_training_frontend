<template>
  <div class="w-full h-full">
    <h1 class="text-4xl text-center">Pannello studente</h1>
    <div
      class="relative flex flex-col mx-auto space-y-6 transform -translate-y-1/2 top-1/2 w-max"
    >
      <router-link to="courses"
        ><UIButton :variant="'indigo'" :size="'xl'"
          >Trova corsi</UIButton
        ></router-link
      >
      <router-link to="courses">
        <UIButton :variant="'indigo'" :size="'xl'"
          >I miei corsi</UIButton
        ></router-link
      >
    </div>
  </div>
</template>

<script>
import UIButton from '@/components/UIButton.vue'
export default {
  components: { UIButton },
  name: 'StudentDashboard'
}
</script>

<style></style>
