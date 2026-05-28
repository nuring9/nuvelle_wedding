"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/authStore";

export default function AdminTemplateRedirect() {
  const router = useRouter();
  const { hasHydrated, isAuthenticated, user } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;
    if (!isAuthenticated) return;
    if (user?.role !== "ROLE_ADMIN") return;

    router.replace("/admin/templates");
  }, [hasHydrated, isAuthenticated, user?.role, router]);

  return null;
}
