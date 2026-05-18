import { ApiResponse, Template } from "@/types/template";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const templateApi = axios.create({
  baseURL: `${BASE_URL}/api/templates`,
  headers: {
    "Content-Type": "application/json",
  },
});

export async function getTemplates(): Promise<Template[]> {
  const res = await templateApi.get<ApiResponse<Template[]>>("");

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿 목록을 불러오지 못했습니다.");
  }
  return res.data.data;
}

export async function getTemplate(templateId: number): Promise<Template> {
  const res = await templateApi.get<ApiResponse<Template>>(`/${templateId}`);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿을 불러오지 못했습니다.");
  }
  return res.data.data;
}
