"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
exports.enroll = exports.createTopic = exports.updateTopic = exports.getTopics = exports.updateTrainingTemplate = exports.createTrainingTemplate = exports.getTrainingTemplates = exports.createCourse = exports.getCourse = exports.getCourses = void 0;
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
function createCourse(course) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/", __assign({}, course))
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.createCourse = createCourse;
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
function createTrainingTemplate(courseId, template) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/templates/", __assign({}, template))
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.createTrainingTemplate = createTrainingTemplate;
function updateTrainingTemplate(courseId, templateId, template) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .put("/courses/" + courseId + "/templates/" + templateId + "/", __assign({}, template))
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.updateTrainingTemplate = updateTrainingTemplate;
function getTopics(courseId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId + "/topics")
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getTopics = getTopics;
function updateTopic(courseId, topicId, topic) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .put("/courses/" + courseId + "/topics/" + topicId + "/", __assign({}, topic))
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.updateTopic = updateTopic;
function createTopic(courseId, topic) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/topics/", __assign({}, topic))
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.createTopic = createTopic;
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
