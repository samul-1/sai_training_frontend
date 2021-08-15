/* eslint-disable */

import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/Home.vue";
import Login from '../views/Login.vue'
import Courses from '../views/Courses.vue'
import StudentDashboard from '../views/StudentDashboard.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/student",
    name: "StudentDashboard",
    component: StudentDashboard,
  },
  {
    path: "/courses",
    name: "Courses",
    component: Courses,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
