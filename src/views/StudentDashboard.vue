<template>
  <h1 class="mb-10 text-3xl text-center">Pannello studente</h1>
  <div class="mx-auto space-x-6 text-center">
    <router-link to="courses"
      ><UIButton :variant="'indigo'" :size="'xl'"
        >Trova corsi</UIButton
      ></router-link
    >
    <UIButton :variant="'indigo'" :size="'xl'">I miei corsi</UIButton>
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
