import axios from "axios";
import { ApiResponse, Template } from "@/types/template";

function getBaseUrl() {
  // 서버 컴포넌트 / Next.js 서버에서 실행될 때
  if (typeof window === "undefined") {
    return process.env.API_URL || "http://localhost:8080";
  }

  // 브라우저에서 실행될 때
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
}

function createTemplateApi() {
  return axios.create({
    baseURL: `${getBaseUrl()}/api/templates`,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export async function getTemplates(): Promise<Template[]> {
  const templateApi = createTemplateApi();

  const res = await templateApi.get<ApiResponse<Template[]>>("");

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿 목록을 불러오지 못했습니다.");
  }

  return res.data.data;
}

export async function getTemplate(templateId: number): Promise<Template> {
  const templateApi = createTemplateApi();

  const res = await templateApi.get<ApiResponse<Template>>(`/${templateId}`);

  if (!res.data.success || !res.data.data) {
    throw new Error(res.data.message || "템플릿을 불러오지 못했습니다.");
  }

  return res.data.data;
}
