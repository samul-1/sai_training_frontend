"use strict";
/* eslint-disable */
exports.__esModule = true;
var vue_router_1 = require("vue-router");
var Home_vue_1 = require("../views/Home.vue");
var Login_vue_1 = require("../views/Login.vue");
var Courses_vue_1 = require("../views/Courses.vue");
var StudentDashboard_vue_1 = require("../views/StudentDashboard.vue");
var StudentCourseDashboard_vue_1 = require("../views/StudentCourseDashboard.vue");
var TeacherCourseDashboard_vue_1 = require("../views/TeacherCourseDashboard.vue");
var TrainingSession_vue_1 = require("../views/TrainingSession.vue");
var TrainingSessionResults_vue_1 = require("../components/TrainingSessionResults.vue");
var CourseTopicList_vue_1 = require("../components/CourseTopicList.vue");
var TrainingSessionsHistory_vue_1 = require("../views/TrainingSessionsHistory.vue");
var routes = [
    {
        path: '/',
        name: 'Home',
        component: Home_vue_1["default"]
    },
    {
        path: '/login',
        name: 'Login',
        component: Login_vue_1["default"]
    },
    {
        path: '/student',
        name: 'StudentDashboard',
        component: StudentDashboard_vue_1["default"]
    },
    {
        path: '/courses',
        name: 'Courses',
        component: Courses_vue_1["default"]
    },
    {
        path: '/course/:courseId',
        name: 'StudentCourseDashboard',
        component: StudentCourseDashboard_vue_1["default"]
    },
    {
        path: '/course/:courseId/train',
        name: 'TrainingSession',
        component: TrainingSession_vue_1["default"]
    },
    {
        path: '/course/:courseId/sessions',
        name: 'TrainingSessionHistory',
        component: TrainingSessionsHistory_vue_1["default"]
    },
    {
        path: '/course/:courseId/sessions/:sessionId',
        name: 'TrainingSessionResults',
        component: TrainingSessionResults_vue_1["default"]
    },
    {
        path: '/course-panel/:courseId',
        name: 'TeacherCourseDashboard',
        component: TeacherCourseDashboard_vue_1["default"]
    },
    {
        path: '/course-panel/:courseId/topics',
        name: 'CourseTopicList',
        component: CourseTopicList_vue_1["default"]
    },
];
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(),
    routes: routes
});
exports["default"] = router;
