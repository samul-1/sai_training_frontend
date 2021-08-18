import { Course, TrainingTemplate } from '@/interfaces';
import axios from 'axios';
export function getCourses(): Promise<Array<Course>> {
  return new Promise((resolve, reject) => {
    axios
      .get('/courses')
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getCourse(courseId: string): Promise<Course> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getTrainingTemplates(
  courseId: string
): Promise<TrainingTemplate[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}/templates`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function enroll(courseId: string): Promise<Course> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/enroll/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}
