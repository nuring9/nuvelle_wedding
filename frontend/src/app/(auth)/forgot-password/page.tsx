"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { requestPasswordReset } from "@/lib/api/auth";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage(null);
    setError(null);

    try {
      await requestPasswordReset({ email });
      setMessage("입력한 이메일로 비밀번호 재설정 링크를 보냈습니다.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "비밀번호 재설정 링크 발송에 실패했습니다.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-50 px-4 py-16">
      <section className="w-full max-w-md rounded-lg border border-neutral-200 bg-white p-8 shadow-sm">
        <h1 className="font-serif text-2xl font-semibold text-neutral-900">
          비밀번호 재설정
        </h1>
        <p className="mt-2 text-sm text-neutral-500">
          가입한 이메일을 입력하면 새 비밀번호를 설정할 수 있는 링크를 보내드립니다.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-neutral-700">
              이메일
            </span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
              className="w-full rounded-lg border border-neutral-200 px-4 py-3 text-sm outline-none transition focus:border-primary-400"
              placeholder="you@example.com"
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
            {isLoading ? "발송 중..." : "재설정 링크 받기"}
          </button>
        </form>

        <Link
          href="/login"
          className="mt-6 block text-center text-sm text-neutral-500 hover:text-neutral-900"
        >
          로그인으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
