"use strict";
exports.__esModule = true;
exports.createQuestion = exports.updateQuestion = exports.getQuestions = exports.bulkCreateQuestions = void 0;
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
