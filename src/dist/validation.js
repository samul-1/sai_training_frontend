"use strict";
exports.__esModule = true;
exports.isValidProgrammingExercise = exports.isValidQuestion = void 0;
function isValidQuestion(question) {
    var _a, _b;
    return !(!question.text ||
        question.text.length == 0 ||
        !question.topic ||
        question.topic.length == 0 ||
        question.topic == '_' ||
        parseInt((_a = question.difficulty) !== null && _a !== void 0 ? _a : '-1') < 0 ||
        parseInt((_b = question.difficulty) !== null && _b !== void 0 ? _b : '-1') > 4 ||
        (!question.is_open_ended &&
            (!question.choices ||
                question.choices.some(function (choice) { return choice.text.length == 0; }) ||
                question.choices.filter(function (choice) { return choice.correct; }).length ==
                    0)));
}
exports.isValidQuestion = isValidQuestion;
function isValidProgrammingExercise(exercise) {
    console.log(exercise);
    return true;
}
exports.isValidProgrammingExercise = isValidProgrammingExercise;
