"use strict";
/* eslint-disable */
exports.__esModule = true;
exports.getMainView = void 0;
var vue_router_1 = require("vue-router");
var store_1 = require("../store");
var Login_vue_1 = require("../views/Login.vue");
var CourseQuestionList_vue_1 = require("../views/CourseQuestionList.vue");
var CourseProgrammingExercisesList_vue_1 = require("../views/CourseProgrammingExercisesList.vue");
var Courses_vue_1 = require("../views/Courses.vue");
var TeacherDashboard_vue_1 = require("../views/TeacherDashboard.vue");
var StudentCourseDashboard_vue_1 = require("../views/StudentCourseDashboard.vue");
var TeacherCourseDashboard_vue_1 = require("../views/TeacherCourseDashboard.vue");
var TrainingSession_vue_1 = require("../views/TrainingSession.vue");
var TrainingSessionResults_vue_1 = require("../components/TrainingSessionResults.vue");
var ProgrammingExerciseImport_vue_1 = require("../components/ProgrammingExerciseImport.vue");
var QuestionImport_vue_1 = require("../components/QuestionImport.vue");
var TexToJson_vue_1 = require("../views/TexToJson.vue");
var TrainingSessionsHistory_vue_1 = require("../views/TrainingSessionsHistory.vue");
var CourseTrainingTemplates_vue_1 = require("../views/CourseTrainingTemplates.vue");
var PageNotFound_vue_1 = require("../views/PageNotFound.vue");
var StudentProgrammingExercisesDashboard_vue_1 = require("../views/StudentProgrammingExercisesDashboard.vue");
var StudentProgrammingExerciseSession_vue_1 = require("../views/StudentProgrammingExerciseSession.vue");
var routes = [
    // {
    //   path: '/',
    //   redirect: '/login',
    // },
    {
        path: '/login/:role?',
        name: 'Login',
        component: Login_vue_1["default"]
    },
    // {
    //   path: '/student',
    //   name: 'StudentDashboard',
    //   component: StudentDashboard,
    //   meta: {
    //     studentsOnly: true,
    //     studentHomepage: true,
    //   },
    // },
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
            studentsOnly: true,
            studentHomepage: true
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
        path: '/course/:courseId/exercises',
        name: 'StudentProgrammingExercisesDashboard',
        component: StudentProgrammingExercisesDashboard_vue_1["default"],
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course/:courseId/exercises/train',
        name: 'StudentProgrammingExerciseSession',
        component: StudentProgrammingExerciseSession_vue_1["default"],
        props: true,
        meta: {
            studentsOnly: true
        }
    },
    {
        path: '/course/:courseId/exercises/history',
        name: 'StudentProgrammingExerciseHistory',
        component: StudentProgrammingExerciseSession_vue_1["default"],
        props: {
            history: true
        },
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
        path: '/course-panel/:courseId/import_exercises',
        name: 'ProgrammingExerciseImport',
        component: ProgrammingExerciseImport_vue_1["default"],
        meta: {
            teachersOnly: true
        }
    },
    {
        path: '/course-panel/:courseId/questions',
        name: 'CourseQuestionList',
        component: CourseQuestionList_vue_1["default"],
        meta: {
            teachersOnly: true
        }
    },
    {
        path: '/course-panel/:courseId/programming_exercises',
        name: 'CourseProgrammingExercisesList',
        component: CourseProgrammingExercisesList_vue_1["default"],
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
    {
        path: '/tex-2-json',
        name: 'TexToJson',
        component: TexToJson_vue_1["default"],
        meta: {
            teachersOnly: true
        }
    },
    {
        path: '/:catchAll(.*)',
        component: PageNotFound_vue_1["default"]
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
    if (router.currentRoute.value.query.redirect) {
        return router.currentRoute.value.query.redirect;
    }
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
    if (to.path == '/') {
        console.log('triggering guard');
        next({
            path: isAuthenticated() ? getMainView() : '/login'
        });
        return;
    }
    if (studentsOnly(to) && !isStudent()) {
        store_1["default"].commit('resetToken');
        next({ path: '/login', query: { redirect: to.fullPath } });
    }
    else if (teachersOnly(to) && !isTeacher()) {
        store_1["default"].commit('resetToken');
        next({
            path: '/login/teacher',
            query: { redirect: to.fullPath }
        });
    }
    else {
        next();
    }
});
exports["default"] = router;
