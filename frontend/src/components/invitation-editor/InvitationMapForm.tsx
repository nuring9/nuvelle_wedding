"use client";

import { UpdateInvitationRequest } from "@/lib/api/invitations";
import InputField from "../common/InputField";

interface InvitationMapFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

export default function InvitationMapForm({
  data,
  onChange,
}: InvitationMapFormProps) {
  return (
    <div className="flex flex-col gap-4">
      <h3 className="text-sm font-semibold text-gray-800">지도 좌표</h3>
      <p className="text-xs text-gray-400 -mt-2">
        네이버 지도 또는 카카오맵에서 좌표를 확인할 수 있습니다.
      </p>
      <div className="grid grid-cols-2 gap-3">
        <InputField
          label="위도 (Latitude)"
          type="number"
          placeholder="37.5665"
          step="any"
          value={data.mapLat ?? ""}
          onChange={(e) =>
            onChange({
              mapLat: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
        />
        <InputField
          label="경도 (Longitude)"
          type="number"
          placeholder="126.9780"
          step="any"
          value={data.mapLng ?? ""}
          onChange={(e) =>
            onChange({
              mapLng: e.target.value ? parseFloat(e.target.value) : undefined,
            })
          }
        />
      </div>
      {data.mapLat && data.mapLng && (
        <a
          href={`https://map.kakao.com/link/map/${data.mapLat},${data.mapLng}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary-500 hover:underline inline-flex items-center gap-1"
        >
          <svg
            className="w-3.5 h-3.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
            />
          </svg>
          카카오맵에서 확인
        </a>
      )}
    </div>
  );
}
