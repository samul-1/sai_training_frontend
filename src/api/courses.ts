import { Course } from '@/interfaces'
import axios from 'axios'
export function getCourses () : Promise<Array<Course>> {
  return new Promise((resolve, reject) => {
    axios
      .get('/courses')
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error))
  })
}

export function getCourse(courseId: string): Promise<Course> {
  return new Promise((resolve, reject) => {
    axios
      .get(`/courses/${courseId}`)
      .then(response => {
        resolve(response.data)
      })
      .catch(error => reject(error))
  })
}
