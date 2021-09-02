"use strict";
exports.__esModule = true;
exports.createTicket = exports.updateAllowedTeachers = exports.getTeachers = void 0;
var axios_1 = require("axios");
function getTeachers() {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .get("/users/teachers")
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.getTeachers = getTeachers;
function updateAllowedTeachers(courseId, teachers) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .patch("/courses/" + courseId + "/", { allowed_teachers: teachers })
            .then(function (response) {
            resolve(response.data);
        })["catch"](function (error) { return reject(error); });
    });
}
exports.updateAllowedTeachers = updateAllowedTeachers;
function createTicket(message, additional_data) {
    return new Promise(function (resolve, reject) {
        axios_1["default"]
            .post('/tickets/', {
            message: message,
            additional_data: additional_data
        })
            .then(function (response) { return resolve(response); })["catch"](function (error) { return reject(error); });
    });
}
exports.createTicket = createTicket;
