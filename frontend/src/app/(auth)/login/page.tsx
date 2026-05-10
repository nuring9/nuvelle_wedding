"use client";

import InputField from "@/components/common/InputField";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useAuth } from "@/hooks/userAuth";
import Link from "next/link";
import { useState } from "react";

export default function LoginPage() {
  const { handleLogin, isLoading, error, clearError } = useAuth();

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
    // 검증 실패하면 로그인 요청을 보내지 않고 중단

    await handleLogin(form);
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

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          <Link
            href="/signup"
            className="text-primary-500 font-medium hover:underline"
          >
            회원가입
          </Link>
        </p>
      </div>
    </>
  );
}
