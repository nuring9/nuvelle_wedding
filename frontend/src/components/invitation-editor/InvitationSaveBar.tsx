"use client";

interface InvitationSaveBarProps {
  isSaving: boolean;
  lastSaved: Date | null;
  onSave: () => void;
}

export default function InvitationSaveBar({
  isSaving,
  lastSaved,
  onSave,
}: InvitationSaveBarProps) {
  const formatLastSaved = (date: Date) => {
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  return (
    <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 border-b border-gray-100">
      <div className="flex items-center gap-2">
        {isSaving ? (
          <>
            <svg
              className="animate-spin h-3.5 w-3.5 text-primary-400"
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
            <span className="text-xs text-gray-500">저장 중...</span>
          </>
        ) : lastSaved ? (
          <>
            <svg
              className="w-3.5 h-3.5 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="text-xs text-gray-500">
              {formatLastSaved(lastSaved)} 저장됨
            </span>
          </>
        ) : (
          <span className="text-xs text-gray-400">저장되지 않음</span>
        )}
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={isSaving}
        className="text-xs text-primary-500 font-medium hover:text-primary-600 transition-colors disabled:opacity-50"
      >
        저장
      </button>
    </div>
  );
}
