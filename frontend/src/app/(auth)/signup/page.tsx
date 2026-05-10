"use client";

import InputField from "@/components/common/InputField";
import PrimaryButton from "@/components/common/PrimaryButton";
import { useAuth } from "@/hooks/userAuth";
import Link from "next/link";
import { useState } from "react";

export default function SignupPage() {
  const { handleSignup, isLoading, error, clearError } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const validate = () => {
    const errors = { name: "", email: "", password: "", passwordConfirm: "" };
    let isValid = true;

    if (!form.name.trim()) {
      errors.name = "이름을 입력해주세요.";
      isValid = false;
    } else if (form.name.trim().length > 50) {
      errors.name = "이름은 50자 이하여야 합니다.";
      isValid = false;
    }

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
    } else if (form.password.length < 8) {
      errors.password = "비밀번호는 8자 이상이어야 합니다.";
      isValid = false;
    }

    if (!form.passwordConfirm) {
      errors.passwordConfirm = "비밀번호 확인을 입력해주세요.";
      isValid = false;
    } else if (form.password !== form.passwordConfirm) {
      // 비밀번호와 비밀번호 확인 일치 여부 검사
      errors.passwordConfirm = "비밀번호가 일치하지 않습니다.";
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
    e.preventDefault(); // 기본 form 제출 새로고침 방지

    if (!validate()) return;

    await handleSignup({
      name: form.name.trim(),
      email: form.email,
      password: form.password,
    });
  };

  return (
    <>
      <h1 className="text-xl font-semibold text-gray-800 mb-6 text-center">
        회원가입
      </h1>

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <InputField
          label="이름" // input 라벨
          name="name" // form 상태 key와 연결
          type="text" // 텍스트 input
          placeholder="이름을 입력하세요" // placeholder
          value={form.name} // 현재 이름 값
          onChange={handleChange} // 입력 변경 함수
          error={fieldErrors.name} // 이름 에러 메시지
          required // 필수 입력 표시
          autoComplete="name" // 이름 자동완성
        />

        <InputField
          label="이메일" // input 라벨
          name="email" // form 상태 key와 연결
          type="email" // 이메일 input
          placeholder="example@email.com" // placeholder
          value={form.email} // 현재 이메일 값
          onChange={handleChange} // 입력 변경 함수
          error={fieldErrors.email} // 이메일 에러 메시지
          required // 필수 입력 표시
          autoComplete="email" // 이메일 자동완성
        />

        <InputField
          label="비밀번호" // input 라벨
          name="password" // form 상태 key와 연결
          type="password" // 비밀번호 input
          placeholder="8자 이상 입력하세요" // placeholder
          value={form.password} // 현재 비밀번호 값
          onChange={handleChange} // 입력 변경 함수
          error={fieldErrors.password} // 비밀번호 에러 메시지
          hint="8자 이상 입력해주세요." // 에러가 없을 때 보여줄 안내 문구
          required // 필수 입력 표시
          autoComplete="new-password" // 새 비밀번호 자동완성
        />

        <InputField
          label="비밀번호 확인" // input 라벨
          name="passwordConfirm" // form 상태 key와 연결
          type="password" // 비밀번호 input
          placeholder="비밀번호를 다시 입력하세요" // placeholder
          value={form.passwordConfirm} // 현재 비밀번호 확인 값
          onChange={handleChange} // 입력 변경 함수
          error={fieldErrors.passwordConfirm} // 비밀번호 확인 에러 메시지
          required // 필수 입력 표시
          autoComplete="new-password" // 새 비밀번호 자동완성
        />

        <PrimaryButton
          type="submit" // form 제출 버튼
          fullWidth // 전체 너비 버튼
          isLoading={isLoading} // 회원가입 요청 중 로딩 표시
          className="mt-2 py-4" // 추가 스타일
        >
          회원가입
        </PrimaryButton>
      </form>

      {/* 로그인 페이지 이동 영역 */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          이미 계정이 있으신가요?{" "}
          <Link
            href="/login" // 로그인 페이지로 이동
            className="text-primary-500 font-medium hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </>
  );
}
