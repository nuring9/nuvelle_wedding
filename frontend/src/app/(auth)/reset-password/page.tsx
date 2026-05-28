"use client";

import { FormEvent, Suspense, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { confirmPasswordReset } from "@/lib/api/auth";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [newPassword, setNewPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setMessage(null);
    setError(null);

    if (!token) {
      setError("비밀번호 재설정 토큰이 없습니다.");
      return;
    }
    if (newPassword !== passwordConfirm) {
      setError("새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    setIsLoading(true);
    try {
      await confirmPasswordReset({ token, newPassword });
      setMessage("비밀번호가 변경되었습니다. 새 비밀번호로 로그인해주세요.");
      setNewPassword("");
      setPasswordConfirm("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "비밀번호 재설정에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-16">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          새 비밀번호 설정
        </h1>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-700">
              새 비밀번호
            </span>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400"
              placeholder="8자 이상 입력"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-700">
              새 비밀번호 확인
            </span>
            <input
              type="password"
              value={passwordConfirm}
              onChange={(event) => setPasswordConfirm(event.target.value)}
              required
              minLength={8}
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400"
              placeholder="한 번 더 입력"
            />
          </label>

          {message && (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
              {message}
            </p>
          )}
          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full py-3 text-sm disabled:opacity-50"
          >
            {isLoading ? "변경 중..." : "비밀번호 변경"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-neutral-500 hover:text-neutral-900"
        >
          로그인으로 이동
        </Link>
      </section>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-16">
          <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500 shadow-sm">
            비밀번호 재설정 화면을 불러오는 중입니다.
          </section>
        </main>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
