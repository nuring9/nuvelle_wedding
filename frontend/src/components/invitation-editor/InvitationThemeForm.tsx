"use client";

import {
  FONT_OPTIONS,
  THEME_OPTIONS,
} from "@/constants/invitation";
import type { UpdateInvitationRequest } from "@/lib/api/invitations";

interface InvitationThemeFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationThemeForm({
  data,
  onChange,
}: InvitationThemeFormProps) {
  return (
    <div className="flex flex-col gap-8">
      {/* 테마 선택 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">테마</h3>
        <div className="grid grid-cols-2 gap-3">
          {THEME_OPTIONS.map((theme) => (
            <button
              key={theme.key}
              type="button"
              onClick={() => onChange({ theme: theme.key })}
              className={`relative flex flex-col gap-2 p-3 rounded-xl border-2 text-left transition-all ${
                data.theme === theme.key
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div
                className="w-full h-8 rounded-lg border border-gray-100 overflow-hidden"
                style={{ backgroundColor: theme.bgColor }}
              >
                <div
                  className="h-full w-1/3"
                  style={{ backgroundColor: theme.primaryColor }}
                />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-800">
                  {theme.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {theme.description}
                </p>
              </div>
              {data.theme === theme.key && (
                <div className="absolute top-2 right-2">
                  <svg
                    className="w-4 h-4 text-primary-500"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* 폰트 선택 */}
      <div className="flex flex-col gap-4">
        <h3 className="text-sm font-semibold text-gray-800">폰트</h3>
        <div className="flex flex-col gap-2">
          {FONT_OPTIONS.map((font) => (
            <button
              key={font.key}
              type="button"
              onClick={() => onChange({ fontFamily: font.key })}
              className={`flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                data.fontFamily === font.key
                  ? "border-primary-500 bg-primary-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col gap-1">
                <p className="text-xs font-medium text-gray-700">
                  {font.label}
                </p>
                <p
                  className="text-sm text-gray-600"
                  style={{ fontFamily: font.fontFamily }}
                >
                  {font.preview}
                </p>
              </div>
              {data.fontFamily === font.key && (
                <svg
                  className="w-4 h-4 text-primary-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
