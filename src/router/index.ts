/* eslint-disable */

import {
  createRouter,
  createWebHistory,
  RouteRecordRaw,
} from 'vue-router';
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

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/student',
    name: 'StudentDashboard',
    component: StudentDashboard,
  },
  {
    path: '/teacher',
    name: 'TeacherDashboard',
    component: TeacherDashboard,
  },
  {
    path: '/courses',
    name: 'Courses',
    component: Courses,
  },
  {
    path: '/course/:courseId',
    name: 'StudentCourseDashboard',
    component: StudentCourseDashboard,
  },
  {
    path: '/course/:courseId/train',
    name: 'TrainingSession',
    component: TrainingSession,
  },
  {
    path: '/course/:courseId/sessions',
    name: 'TrainingSessionHistory',
    component: TrainingSessionsHistory,
  },
  {
    path: '/course/:courseId/sessions/:sessionId',
    name: 'TrainingSessionResults',
    component: TrainingSessionResults,
  },
  {
    path: '/course-panel/:courseId',
    name: 'TeacherCourseDashboard',
    component: TeacherCourseDashboard,
    // children: [
    //   {
    //     path: 'topics',
    //     component: CourseTopicList,
    //   },
    // ],
  },
  // {
  //   path: '/course-panel/:courseId/topics',
  //   name: 'CourseTopicList',
  //   component: CourseTopicList,
  // },
  {
    path: '/course-panel/:courseId/import',
    name: 'QuestionImport',
    component: QuestionImport,
  },
  {
    path: '/course-panel/:courseId/templates',
    name: 'CourseTrainingTemplates',
    component: CourseTrainingTemplates,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
