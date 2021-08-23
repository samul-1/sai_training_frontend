"use strict";
exports.__esModule = true;
exports.getTrainingSessionResults = exports.turnInTrainingSession = exports.getTrainingSessions = exports.getCurrentTrainingSession = void 0;
var axios_1 = require("axios");
function getCurrentTrainingSession(courseId, templateId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/sessions/current" + (templateId ? '/?template_id=' + templateId : '/'))
            .then(function (response) {
            console.log(response.status);
            if (response.status == 204) {
                reject(response);
            }
            else {
                resolve(response.data);
            }
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getCurrentTrainingSession = getCurrentTrainingSession;
function getTrainingSessions(courseId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId + "/sessions/")
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getTrainingSessions = getTrainingSessions;
function turnInTrainingSession(courseId, answers) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post("/courses/" + courseId + "/sessions/turn_in/", { answers: answers })
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.turnInTrainingSession = turnInTrainingSession;
function getTrainingSessionResults(courseId, sessionId) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/courses/" + courseId + "/sessions/" + sessionId + "/")
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getTrainingSessionResults = getTrainingSessionResults;
