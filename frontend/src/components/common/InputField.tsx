"use client";

import { forwardRef } from "react";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string; // 안내 문구
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, error, hint, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label className="text-sm font-medium text-gray-700">
            {label}
            {props.required && <span className="text-red-400 ml-1">*</span>}
          </label>
        )}
        {/* 실제 입력 부분 */}
        <input
          ref={ref}
          className={`input-base ${error ? "border-red-400 focus:ring-red-300" : ""} ${className}`}
          {...props}
        />

        {error && <p className="text-xs text-red-500">{error}</p>}

        {hint && !error && <p className="text-xs text-red-500">{hint}</p>}
      </div>
    );
  },
);

// React Devtoolse에 표시될 컴포넌트 이름
InputField.displayName = "InputField";

export default InputField;
