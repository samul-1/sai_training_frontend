"use strict";
exports.__esModule = true;
exports.enroll = exports.getTrainingTemplates = exports.getCourse = exports.getCourses = void 0;
var axios_1 = require("axios");
function getCourses() {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get('/courses')
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getCourses = getCourses;
function getCourse(courseId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId)
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getCourse = getCourse;
function getTrainingTemplates(courseId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId + "/templates")
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getTrainingTemplates = getTrainingTemplates;
function enroll(courseId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/enroll/")
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.enroll = enroll;
