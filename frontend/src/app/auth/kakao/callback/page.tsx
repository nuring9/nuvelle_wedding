"use client";

import { useAuth } from "@/hooks/userAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";

function KakaoCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { handleKakaoCallback, error } = useAuth();
  const called = useRef(false);

  useEffect(() => {
    if (called.current) return;
    const code = searchParams.get("code");
    const errorParam = searchParams.get("error");

    if (errorParam) {
      router.replace("/login");
      return;
    }

    if (!code) {
      router.replace("/login");
      return;
    }

    called.current = true;
    handleKakaoCallback(code);
  }, [searchParams, handleKakaoCallback, router]);

  if (error) {
    return (
      <div className="text-center">
        <p className="text-sm text-red-500 mb-4">{error}</p>
        <button
          onClick={() => router.replace("/login")}
          className="text-sm text-primary-500 underline"
        >
          로그인 페이지로 돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="text-center py-8">
      <p className="text-sm text-gray-500">카카오 로그인 처리 중...</p>
    </div>
  );
}

export default function KakaoCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="text-center py-8">
          <p className="text-sm text-gray-500">카카오 로그인 처리 중...</p>
        </div>
      }
    >
      <KakaoCallbackContent />
    </Suspense>
  );
}
