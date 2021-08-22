/* eslint-disable */

import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteMeta,
  RouteRecord,
  RouteRecordRaw,
} from 'vue-router';
import store from '../store';
import Home from '../views/Home.vue';
import Login from '../views/Login.vue';
import Courses from '../views/Courses.vue';
import StudentDashboard from '../views/StudentDashboard.vue';
import TeacherDashboard from '../views/TeacherDashboard.vue';
import StudentCourseDashboard from '../views/StudentCourseDashboard.vue';
import TeacherCourseDashboard from '../views/TeacherCourseDashboard.vue';
import TrainingSession from '../views/TrainingSession.vue';
import TrainingSessionResults from '../components/TrainingSessionResults.vue';
import CourseTopicList from '../components/CourseTopicList.vue';
import QuestionImport from '../components/QuestionImport.vue';
import TrainingSessionsHistory from '../views/TrainingSessionsHistory.vue';
import CourseTrainingTemplates from '../views/CourseTrainingTemplates.vue';
import { User } from '@/interfaces';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/login',
  },
  {
    path: '/login/:role?',
    name: 'Login',
    component: Login,
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
    meta: {
      studentsOnly: true,
      studentHomepage: true,
    },
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
    meta: {
      teachersOnly: true,
      teacherHomepage: true,
    },
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
    meta: {
      studentsOnly: true,
    },
  },
  {
    path: '/course/:courseId',
    name: 'StudentCourseDashboard',
    component: StudentCourseDashboard,
    meta: {
      studentsOnly: true,
    },
  },
  {
    path: '/course/:courseId/train',
    name: 'TrainingSession',
    component: TrainingSession,
    meta: {
      studentsOnly: true,
    },
  },
  {
    path: '/course/:courseId/sessions',
    name: 'TrainingSessionHistory',
    component: TrainingSessionsHistory,
    meta: {
      studentsOnly: true,
    },
  },
  {
    path: '/course/:courseId/sessions/:sessionId',
    name: 'TrainingSessionResults',
    component: TrainingSessionResults,
    meta: {
      studentsOnly: true,
    },
  },
  {
    path: '/course-panel/:courseId',
    name: 'TeacherCourseDashboard',
    component: TeacherCourseDashboard,
    meta: {
      teachersOnly: true,
    },
  },
  {
    path: '/course-panel/:courseId/import',
    name: 'QuestionImport',
    component: QuestionImport,
    meta: {
      teachersOnly: true,
    },
  },
  {
    path: '/course-panel/:courseId/templates',
    name: 'CourseTrainingTemplates',
    component: CourseTrainingTemplates,
    meta: {
      teachersOnly: true,
    },
  },
];

function teachersOnly(route: RouteLocationNormalized): boolean {
  return !!route.meta?.teachersOnly;
}

function studentsOnly(route: RouteLocationNormalized): boolean {
  return !!route.meta?.studentsOnly;
}

function isAuthenticated(): boolean {
  return store.getters.isAuthenticated;
}

function isTeacher() {
  return isAuthenticated() && (store.state.user as User).is_teacher;
}

function isStudent() {
  return isAuthenticated() && !(store.state.user as User).is_teacher;
}

export function getMainView(): string | undefined {
  return isTeacher()
    ? (routes.find(
        (route) => (route.meta as RouteMeta)?.teacherHomepage
      )?.path as string)
    : routes.find(
        (route) => (route.meta as RouteMeta)?.studentHomepage
      )?.path;
}

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _from, next) => {
  if (studentsOnly(to) && !isStudent()) {
    //store.commit('setRedirectToAfterLogin', to);
    next('/login');
  } else if (teachersOnly(to) && !isTeacher()) {
    //store.commit('setRedirectToAfterLogin', to);
    next('/login/teacher');
  } else {
    next();
  }
});

export default router;
