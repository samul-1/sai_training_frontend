import { TrainingSession } from '@/interfaces'
import axios from 'axios'
export function getCurrentTrainingSession (courseId : string, templateId : string | null) : Promise<TrainingSession> {
    return new Promise((resolve, reject) => {
        axios
        .post(`/courses/${courseId}/sessions/current${templateId ? "/?template_id=" + templateId : "/"}`)
            .then(response => {
                resolve(response.data)
            })
            .catch(error => reject(error))
        })

}