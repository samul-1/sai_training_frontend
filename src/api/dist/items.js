"use strict";
exports.__esModule = true;
exports.bulkCreateQuestions = void 0;
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
