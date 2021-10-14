import {
  DifficultyProfile,
  ExerciseSubmission,
  ProgrammingExercise,
  Question,
} from '@/interfaces';
import axios from 'axios';

export function bulkCreateQuestions(
  courseId: string,
  questions: Question[]
): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/questions/`, questions)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}
export function bulkCreateProgrammingExercises(
  courseId: string,
  exercises: ProgrammingExercise[]
): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/programming_exercises/`, exercises)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function deleteQuestion(
  courseId: string,
  questionId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/courses/${courseId}/questions/${questionId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function deleteProgrammingExercise(
  courseId: string,
  exerciseId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `/courses/${courseId}/programming_exercises/${exerciseId}/`
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getQuestions(
  courseId: string,
  topicId: string | null,
  difficulty: string | null,
  page: number // if -1, get all questions
): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/courses/${courseId}/${
          topicId ? 'topics/' + topicId + '/' : ''
        }questions/${difficulty ? '?difficulty=' + difficulty : ''}${
          difficulty ? '&' : '?'
        }page=${page != -1 ? page : '1&size=99999999'}`
      )
      .then((response) => {
        resolve(response.data.results);
      })
      .catch((error) => reject(error));
  });
}

export function getProgrammingExercises(
  courseId: string,
  topicId: string | null,
  difficulty: string | null,
  page: number
): Promise<ProgrammingExercise[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/courses/${courseId}/${
          topicId ? 'topics/' + topicId + '/' : ''
        }programming_exercises/${
          difficulty ? '?difficulty=' + difficulty : ''
        }${difficulty ? '&' : '?'}page=${page}`
      )
      .then((response) => {
        resolve(response.data.results);
      })
      .catch((error) => reject(error));
  });
}

export function updateQuestion(
  courseId: string,
  question: Question
): Promise<Question> {
  return new Promise((resolve, reject) => {
    axios
      .put(`/courses/${courseId}/questions/${question.id}/`, question)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function updateProgrammingExercise(
  courseId: string,
  exercise: ProgrammingExercise
): Promise<ProgrammingExercise> {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `/courses/${courseId}/programming_exercises/${exercise.id}/`,
        exercise
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function createQuestion(
  courseId: string,
  question: Question
): Promise<Question> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/questions/`, question)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function createProgrammingExercise(
  courseId: string,
  exercise: ProgrammingExercise
): Promise<ProgrammingExercise> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/programming_exercises/`, exercise)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getProgrammingExercisesById(
  courseId: string,
  idList: string[]
): Promise<ProgrammingExercise[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `courses/${courseId}/programming_exercises/bulk_get/?ids=${idList.join(
          ','
        )}`
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function postExerciseSubmission(
  courseId: string,
  exerciseId: string,
  code: string
): Promise<ExerciseSubmission> {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `courses/${courseId}/programming_exercises/${exerciseId}/submit/`,
        {
          code,
        }
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getRandomProgrammingExercises(
  courseId: string,
  topicId: string,
  difficulty_profile: DifficultyProfile,
  amount: number
): Promise<ProgrammingExercise[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `courses/${courseId}/topics/${topicId}/programming_exercises/get_matching_items/?amount=${amount}&difficulty_profile=${difficulty_profile}`
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function getProgrammingExercisesHistory(
  courseId: string
): Promise<ProgrammingExercise[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`courses/${courseId}/programming_exercises/history/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error);
      });
  });
}
