"use client";

interface PrimaryButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  fullWidth?: boolean;
}

export default function PrimaryButton({
  children,
  isLoading = false,
  fullWidth = false,
  className = "",
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <button
      className={`btn-primary ${fullWidth ? "w-full" : ""} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            />
          </svg>
          처리 중...
        </span>
      ) : (
        children
      )}
    </button>
  );
}
