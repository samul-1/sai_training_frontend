"use strict";
/* eslint-disable */
exports.__esModule = true;
exports.getMainView = void 0;
var vue_router_1 = require("vue-router");
var store_1 = require("../store");
var Login_vue_1 = require("../views/Login.vue");
var Courses_vue_1 = require("../views/Courses.vue");
var StudentDashboard_vue_1 = require("../views/StudentDashboard.vue");
var TeacherDashboard_vue_1 = require("../views/TeacherDashboard.vue");
var StudentCourseDashboard_vue_1 = require("../views/StudentCourseDashboard.vue");
var TeacherCourseDashboard_vue_1 = require("../views/TeacherCourseDashboard.vue");
var TrainingSession_vue_1 = require("../views/TrainingSession.vue");
var TrainingSessionResults_vue_1 = require("../components/TrainingSessionResults.vue");
var QuestionImport_vue_1 = require("../components/QuestionImport.vue");
var TrainingSessionsHistory_vue_1 = require("../views/TrainingSessionsHistory.vue");
var CourseTrainingTemplates_vue_1 = require("../views/CourseTrainingTemplates.vue");
var routes = [
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login/:role?',
        name: 'Login',
        component: Login_vue_1["default"]
    },
    {
        path: '/student',
        name: 'StudentDashboard',
        component: StudentDashboard_vue_1["default"],
        meta: {
            studentsOnly: true,
            studentHomepage: true
        }
    },
    {
        path: '/teacher',
        name: 'TeacherDashboard',
        component: TeacherDashboard_vue_1["default"],
        meta: {
            teachersOnly: true,
            teacherHomepage: true
        }
    },
    {
        path: '/courses',
        name: 'Courses',
        component: Courses_vue_1["default"],
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course/:courseId',
        name: 'StudentCourseDashboard',
        component: StudentCourseDashboard_vue_1["default"],
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course/:courseId/train',
        name: 'TrainingSession',
        component: TrainingSession_vue_1["default"],
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course/:courseId/sessions',
        name: 'TrainingSessionHistory',
        component: TrainingSessionsHistory_vue_1["default"],
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course/:courseId/sessions/:sessionId',
        name: 'TrainingSessionResults',
        component: TrainingSessionResults_vue_1["default"],
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course-panel/:courseId',
        name: 'TeacherCourseDashboard',
        component: TeacherCourseDashboard_vue_1["default"],
        meta: {
            teachersOnly: true
        }
    },
    {
        path: '/course-panel/:courseId/import',
        name: 'QuestionImport',
        component: QuestionImport_vue_1["default"],
        meta: {
            teachersOnly: true
        }
    },
    {
        path: '/course-panel/:courseId/templates',
        name: 'CourseTrainingTemplates',
        component: CourseTrainingTemplates_vue_1["default"],
        meta: {
            teachersOnly: true
        }
    },
];
function teachersOnly(route) {
    var _a;
    return !!((_a = route.meta) === null || _a === void 0 ? void 0 : _a.teachersOnly);
}
function studentsOnly(route) {
    var _a;
    return !!((_a = route.meta) === null || _a === void 0 ? void 0 : _a.studentsOnly);
}
function isAuthenticated() {
    return store_1["default"].getters.isAuthenticated;
}
function isTeacher() {
    return isAuthenticated() && store_1["default"].state.user.is_teacher;
}
function isStudent() {
    return isAuthenticated() && !store_1["default"].state.user.is_teacher;
}
function getMainView() {
    var _a, _b;
    return isTeacher()
        ? (_a = routes.find(function (route) { var _a; return (_a = route.meta) === null || _a === void 0 ? void 0 : _a.teacherHomepage; })) === null || _a === void 0 ? void 0 : _a.path
        : (_b = routes.find(function (route) { var _a; return (_a = route.meta) === null || _a === void 0 ? void 0 : _a.studentHomepage; })) === null || _b === void 0 ? void 0 : _b.path;
}
exports.getMainView = getMainView;
var router = vue_router_1.createRouter({
    history: vue_router_1.createWebHistory(),
    routes: routes
});
router.beforeEach(function (to, _from, next) {
    if (studentsOnly(to) && !isStudent()) {
        //store.commit('setRedirectToAfterLogin', to);
        next('/login');
    }
    else if (teachersOnly(to) && !isTeacher()) {
        //store.commit('setRedirectToAfterLogin', to);
        next('/login/teacher');
    }
    else {
        next();
    }
});
exports["default"] = router;
