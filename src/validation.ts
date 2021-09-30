import { Question, ProgrammingExercise } from './interfaces';

export function isValidQuestion(question: Question): boolean {
  return !(
    !question.text ||
    question.text.length == 0 ||
    !question.topic ||
    question.topic.length == 0 ||
    question.topic == '_' ||
    parseInt(question.difficulty ?? '-1') < 0 ||
    parseInt(question.difficulty ?? '-1') > 4 ||
    !question.choices ||
    question.choices.some((choice) => choice.text.length == 0) ||
    question.choices.filter((choice) => choice.correct).length == 0
  );
}

export function isValidProgrammingExercise(
  exercise: ProgrammingExercise
): boolean {
  console.log(exercise);
  return true;
}
