export type PlanStatus = "DRAFT" | "SAVED";

export interface HoneymoonPlanDayResponse {
  id: number;
  dayNumber: number;
  date: string | null;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  tips: string;
}

export interface HoneymoonPlanResponse {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  companionStyle: string | null;
  requestSummary: string;
  aiGeneratedContent: string;
  status: PlanStatus;
  days: HoneymoonPlanDayResponse[];
  createdAt: string;
  updatedAt: string;
}

export interface HoneymoonPlanSummaryResponse {
  id: number;
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyle: string;
  status: PlanStatus;
  totalDays: number;
  createdAt: string;
}

export interface HoneymoonPlanGenerateRequest {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
  travelStyles: string[];
  companionStyle?: string;
  mustInclude?: string;
  mustExclude?: string;
}

export interface HoneymoonPlanUpdateRequest {
  destination?: string;
  startDate?: string;
  endDate?: string;
  budget?: string;
  travelStyles?: string[];
  companionStyle?: string;
}

export interface HoneymoonPlanDayUpdateRequest {
  title?: string;
  description?: string;
  activities?: string[];
  meals?: string[];
  tips?: string;
}

// 챗봇 관련
export type MessageRole = "USER" | "ASSISTANT";

export interface HoneymoonChatMessage {
  id: number;
  role: MessageRole;
  content: string;
  createdAt: string;
}

export interface HoneymoonChatRequest {
  message: string;
}
