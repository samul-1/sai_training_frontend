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
