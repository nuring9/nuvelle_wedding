"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {
  const router = useRouter();

  //   관리자 진입 시 템플릿 목록으로 리다이렉트
  useEffect(() => {
    router.replace("/admin/templates");
  }, [router]);

  return null;
}
