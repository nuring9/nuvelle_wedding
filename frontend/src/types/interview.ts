export interface WeddingInterviewResponse {
  id: number;
  question1: string | null;
  answer1: string | null;
  question2: string | null;
  answer2: string | null;
  question3: string | null;
  answer3: string | null;
  question4: string | null;
  answer4: string | null;
  question5: string | null;
  answer5: string | null;
}

export interface WeddingInterviewRequest {
  question1?: string;
  answer1?: string;
  question2?: string;
  answer2?: string;
  question3?: string;
  answer3?: string;
  question4?: string;
  answer4?: string;
  question5?: string;
  answer5?: string;
}
