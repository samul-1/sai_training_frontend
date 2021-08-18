import { TrainingSession } from '@/interfaces';
import axios from 'axios';
export function getCurrentTrainingSession(
  courseId: string,
  templateId: string | null
): Promise<TrainingSession> {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `/courses/${courseId}/sessions/current${
          templateId ? '/?template_id=' + templateId : '/'
        }`
      )
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function turnInTrainingSession(
  courseId: string,
  answers: Record<string, string | null>
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/sessions/turn_in/`, { answers })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getTrainingSessionResults(
  courseId: string,
  sessionId: string
): Promise<unknown> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}/sessions/${sessionId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}
