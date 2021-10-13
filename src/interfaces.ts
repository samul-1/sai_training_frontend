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
  uses_programming_exercises: boolean;
}

export interface CourseStats {
  number_enrolled: number;
  training_sessions: number;
  average_correct_percentage: number;
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
  custom?: boolean;
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
  is_open_ended: boolean;
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
  initial_code?: string;
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
  timestamp: string;
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
  items_count?: number;
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
