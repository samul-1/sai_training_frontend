export interface Course {
  name: string;
  description: string;
  creator: string;
  enrolled?: boolean;
  number_enrolled?: number;
}

export interface TrainingTemplateRule {
  topic: string;
  amount: number;
  difficulty_profile: string;
}

export interface TrainingTemplate {
  name: string;
  description?: string;
  rules: TrainingTemplateRule[];
}

export interface Choice {
  id: string;
  text: string;
  correct?: boolean;
}
export interface Question {
  id: string;
  text: string;
  choices: Choice[];
  selected_choice?: string;
}
export interface TrainingSession {
  questions: Question[];
  begin_timestamp: string;
}

export interface TrainingSessionResults {
  id: string;
  begin_timestamp: string;
  end_timestamp: string;
  questions: Question[];
}

export interface Topic {
  id: string;
  name: string;
}
