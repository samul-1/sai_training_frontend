export interface Course {
    name: string
    description: string
    creator: string
    enrolled?: boolean
    number_enrolled?: number
}

export interface TrainingTemplateRule {
    topic: string,
    amount: number,
    difficulty_profile: string
}

export interface TrainingTemplate {
    name: string
    description?: string
    rules: TrainingTemplateRule[]
}

export interface Choice {
    id: string
    text: string
}
export interface Question {
    id: string
    text: string
    choices: Choice[]
}
export interface TrainingSession {
    questions: Question[]
}