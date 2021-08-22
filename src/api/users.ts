import { User } from '@/interfaces';
import axios, { AxiosResponse } from 'axios';

export function getTeachers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/users/teachers`)
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
