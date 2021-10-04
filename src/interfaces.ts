export interface Course {
  id?: string;
  name: string;
  description: string;
  creator: string;
  creator_id?: string;
  enrolled?: boolean;
  number_enrolled?: number;
  allowed_teachers?: string[];
  in_progress_session?: boolean;
}

export interface TrainingTemplateRule {
  topic: string;
  amount: number;
  difficulty_profile: string;
}

export interface TrainingTemplate {
  id: string;
  name: string;
  description?: string;
  rules: TrainingTemplateRule[];
}

export interface Choice {
  id: string;
  text: string;
  correct?: boolean;
}
export interface HTMLInputEvent extends Event {
  target: HTMLInputElement & EventTarget;
}
export interface Question {
  id: string;
  text: string;
  topic: string;
  choices: Choice[];
  selected_choice?: string;
  difficulty?: string;
}

export interface TestCase {
  code: string;
}
export interface ProgrammingExercise {
  id: string;
  text: string;
  topic: string;
  testcases: TestCase[];
  difficulty?: string;
  draftCode?: string;
  submissions?: ExerciseSubmission[];
}

export interface ExerciseSubmission {
  id: string;
  code: string;
  passing: boolean;
  outcomes: {
    code: string;
    passed: boolean;
    details?: string;
  }[];
}

export interface TrainingSession {
  id: string;
  questions: Question[];
  begin_timestamp: string;
}

export interface TrainingSessionResults {
  id: string;
  begin_timestamp: string;
  score: number;
  end_timestamp: string;
  questions: Question[];
  help_texts?: Record<string, string>;
}

export interface Topic {
  id?: string;
  name: string;
  help_text?: string;
}

export interface User {
  email: string;
  full_name: string;
  is_teacher: boolean;
}

export type DifficultyProfile =
  | 'easy_only'
  | 'mostly_easy'
  | 'balanced'
  | 'mostly_hard'
  | 'hard_only';
