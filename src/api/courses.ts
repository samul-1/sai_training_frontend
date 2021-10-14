import {
  Course,
  CourseStats,
  Topic,
  TrainingTemplate,
} from '@/interfaces';
import axios from 'axios';

export function getCourses(): Promise<Array<Course>> {
  return new Promise((resolve, reject) => {
    axios
      .get('/courses/')
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getCourse(courseId: string): Promise<Course> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getCourseStats(
  courseId: string
): Promise<CourseStats> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}/stats/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function createCourse(course: Course): Promise<Course> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/`, {
        ...course,
      })
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
      .get(`/courses/${courseId}/templates/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function createTrainingTemplate(
  courseId: string,
  template: TrainingTemplate
): Promise<TrainingTemplate> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/templates/`, {
        ...template,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function updateTrainingTemplate(
  courseId: string,
  templateId: string,
  template: TrainingTemplate
): Promise<TrainingTemplate> {
  return new Promise((resolve, reject) => {
    axios
      .put(`/courses/${courseId}/templates/${templateId}/`, {
        ...template,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function getTopics(courseId: string): Promise<Topic[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}/topics/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function deleteTopic(
  courseId: string,
  topicId: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    axios
      .delete(`/courses/${courseId}/topics/${topicId}/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function updateTopic(
  courseId: string,
  topicId: string,
  topic: Topic
): Promise<Topic> {
  return new Promise((resolve, reject) => {
    axios
      .put(`/courses/${courseId}/topics/${topicId}/`, {
        ...topic,
      })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function createTopic(
  courseId: string,
  topic: Topic
): Promise<Topic> {
  return new Promise((resolve, reject) => {
    axios
      .post(`/courses/${courseId}/topics/`, {
        ...topic,
      })
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
