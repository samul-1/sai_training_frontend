import { Question } from '@/interfaces';
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

export function getQuestions(
  courseId: string,
  topicId: string | null,
  difficulty: string | null,
  page: number
): Promise<Question[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `/courses/${courseId}/${
          topicId ? 'topics/' + topicId + '/' : ''
        }questions${difficulty ? '?difficulty=' + difficulty : ''}${
          difficulty ? '&' : '?'
        }page=${page}/`
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
