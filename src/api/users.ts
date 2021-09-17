import { User } from '@/interfaces';
import axios, { AxiosResponse } from 'axios';

export function getTeachers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/users/teachers/`)
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function updateAllowedTeachers(
  courseId: string,
  teachers: string[]
): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    axios
      .patch(`/courses/${courseId}/`, { allowed_teachers: teachers })
      .then((response) => {
        resolve(response.data);
      })
      .catch((error) => reject(error));
  });
}

export function createTicket(
  message: string,
  additional_data: {
    path: string;
    browser: string;
  }
): Promise<AxiosResponse> {
  return new Promise((resolve, reject) => {
    axios
      .post('/tickets/', {
        message,
        additional_data,
      })
      .then((response) => resolve(response))
      .catch((error) => reject(error));
  });
}
