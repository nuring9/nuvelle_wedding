"use client";

import { useAuthStore } from "@/stores/authStore";
import { useRouter } from "next/navigation";
import PrimaryButton from "../common/PrimaryButton";

interface TemplateSelectButtonProps {
  templateId: number;
  isLoading?: boolean;
}

export default function TemplateSelectButton({
  templateId,
  isLoading,
}: TemplateSelectButtonProps) {
  const router = useRouter();

  const { isAuthenticated } = useAuthStore();

  const handleClick = () => {
    if (!isAuthenticated) {
      //  비로그인 상태면 로그인 페이지, 로그인 후 다시 템플릿 사용 페이지로 돌아올 수 있도록 redirect 값
      router.push(`login?redirect=/templates/${templateId}/use`);
    }
    // 로그인 상태면 템플릿 사용 페이지로 이동
    router.push(`/templates/${templateId}/use`);
  };

  return (
    <PrimaryButton
      onClick={handleClick}
      isLoading={isLoading}
      fullWidth
      className="py-4 text-base"
    >
      이 템플릿으로 시작하기
    </PrimaryButton>
  );
}
