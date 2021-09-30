"use strict";
exports.__esModule = true;
exports.createProgrammingExercise = exports.createQuestion = exports.updateProgrammingExercise = exports.updateQuestion = exports.getProgrammingExercises = exports.getQuestions = exports.bulkCreateQuestions = void 0;
var axios_1 = require("axios");
function bulkCreateQuestions(courseId, questions) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/questions/", questions)
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.bulkCreateQuestions = bulkCreateQuestions;
function getQuestions(courseId, topicId, difficulty, page) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId + "/" + (topicId ? 'topics/' + topicId + '/' : '') + "questions/" + (difficulty ? '?difficulty=' + difficulty : '') + (difficulty ? '&' : '?') + "page=" + page)
            .then(function (response) {
            resolve(response.data.results);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getQuestions = getQuestions;
function getProgrammingExercises(courseId, topicId, difficulty, page) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId + "/" + (topicId ? 'topics/' + topicId + '/' : '') + "programming_exercises/" + (difficulty ? '?difficulty=' + difficulty : '') + (difficulty ? '&' : '?') + "page=" + page)
            .then(function (response) {
            resolve(response.data.results);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getProgrammingExercises = getProgrammingExercises;
function updateQuestion(courseId, question) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .put("/courses/" + courseId + "/questions/" + question.id + "/", question)
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.updateQuestion = updateQuestion;
function updateProgrammingExercise(courseId, exercise) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .put("/courses/" + courseId + "/programming_exercises/" + exercise.id + "/", exercise)
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.updateProgrammingExercise = updateProgrammingExercise;
function createQuestion(courseId, question) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/questions/", question)
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.createQuestion = createQuestion;
function createProgrammingExercise(courseId, exercise) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/programming_exercises/", exercise)
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.createProgrammingExercise = createProgrammingExercise;
