"use client";

import InputField from "@/components/common/InputField";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useAuth } from "@/hooks/userAuth";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { handleLogin, startKakaoLogin, isLoading, error, clearError } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  });

  const validate = () => {
    const errors = { email: "", password: "" };
    let isValid = true;

    if (!form.email) {
      errors.email = "이메일을 입력해주세요";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      errors.email = "올바른 이메일 형식이 아닙니다.";
      isValid = false;
    }

    if (!form.password) {
      errors.password = "비밀번호를 입력해주세요.";
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setForm((prev) => ({ ...prev, [name]: value }));

    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }

    if (error) clearError();
  };

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    const fieldError = await handleLogin(form);
    if (fieldError) {
      setFieldErrors((prev) => ({ ...prev, [fieldError.field]: fieldError.message }));
    }
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        로그인
      </h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="이메일"
          name="email"
          type="email"
          placeholder="example@email.com"
          value={form.email}
          onChange={handleChange}
          error={fieldErrors.email}
          required
          autoComplete="email"
        />

        <InputField
          label="비밀번호"
          name="password"
          type="password"
          placeholder="비밀번호를 입력하세요"
          value={form.password}
          onChange={handleChange}
          error={fieldErrors.password}
          required
          autoComplete="current-password"
        />

        <PrimaryButton
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="mt-2 py-4"
        >
          로그인
        </PrimaryButton>
      </form>

      <div className="mt-4 flex items-center gap-3">
        <hr className="flex-1 border-gray-200" />
        <span className="text-xs text-gray-400">또는</span>
        <hr className="flex-1 border-gray-200" />
      </div>

      <button
        type="button"
        onClick={startKakaoLogin}
        className="mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm"
        style={{ backgroundColor: "#FEE500", color: "#191919" }}
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9 1C4.582 1 1 3.896 1 7.455c0 2.258 1.468 4.236 3.674 5.364L3.8 16.2a.25.25 0 0 0 .37.27L8.4 13.87c.195.014.393.022.6.022 4.418 0 8-2.896 8-6.437C17 3.896 13.418 1 9 1z"
            fill="#191919"
          />
        </svg>
        카카오로 로그인
      </button>

      <div className="mt-6 flex items-center justify-center gap-4 text-sm text-gray-500">
        <p>
          <Link
            href="/signup"
            className="text-primary-500 font-medium hover:underline"
          >
            회원가입
          </Link>
        </p>
        <span className="text-gray-300">|</span>
        <Link href="/forgot-password" className="hover:text-gray-800">
          비밀번호 재설정
        </Link>
      </div>
    </>
  );
}
