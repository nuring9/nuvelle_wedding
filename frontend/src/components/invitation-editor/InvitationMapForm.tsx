"use client";

import { useEffect, useRef, useState } from "react";
import { UpdateInvitationRequest } from "@/lib/api/invitations";
import InputField from "../common/InputField";

interface InvitationMapFormProps {
  data: UpdateInvitationRequest;
  onChange: (data: Partial<UpdateInvitationRequest>) => void;
}

declare global {
  interface Window {
    daum?: {
      Postcode: new (options: {
        oncomplete: (result: { address: string; buildingName: string }) => void;
      }) => { open: () => void };
    };
  }
}

async function geocodeAddress(
  address: string,
): Promise<{ lat: number; lng: number } | null> {
  const res = await fetch(
    `/api/geocode?address=${encodeURIComponent(address)}`,
  );
  if (!res.ok) return null;
  return res.json();
}

export default function InvitationMapForm({
  data,
  onChange,
}: InvitationMapFormProps) {
  const [address, setAddress] = useState<string>(data.venueAddress ?? "");
  const [isSearching, setIsSearching] = useState(false);
  const [geocodeError, setGeocodeError] = useState<string | null>(null);
  const scriptLoaded = useRef(false);

  // Daum Postcode 스크립트 동적 로드
  useEffect(() => {
    if (scriptLoaded.current) return;
    if (document.getElementById("daum-postcode-script")) {
      scriptLoaded.current = true;
      return;
    }
    const script = document.createElement("script");
    script.id = "daum-postcode-script";
    script.src =
      "//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.current = true;
    };
    document.head.appendChild(script);
  }, []);

  function openPostcode() {
    if (!window.daum?.Postcode) return;
    new window.daum.Postcode({
      oncomplete: async (result) => {
        const fullAddress = result.buildingName
          ? `${result.address} (${result.buildingName})`
          : result.address;
        setAddress(fullAddress);
        setGeocodeError(null);
        setIsSearching(true);

        const coords = await geocodeAddress(result.address);
        setIsSearching(false);

        if (coords) {
          onChange({ venueAddress: fullAddress, mapLat: coords.lat, mapLng: coords.lng });
        } else {
          setGeocodeError("좌표를 자동으로 가져오지 못했습니다. 직접 입력해 주세요.");
        }
      },
    }).open();
  }

  return (
    <div className="flex flex-col gap-4">
      {/* 주소 검색 */}
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div className="flex-1">
            <InputField
              label="주소"
              placeholder="주소 검색 버튼을 눌러주세요"
              value={address}
              readOnly
              onChange={() => {}}
            />
          </div>
          <div className="flex items-end pb-0.5">
            <button
              type="button"
              onClick={openPostcode}
              className="h-10 px-4 rounded-lg bg-primary-500 text-white text-sm font-medium hover:bg-primary-600 transition-colors whitespace-nowrap"
            >
              주소 검색
            </button>
          </div>
        </div>

        {isSearching && (
          <p className="text-xs text-gray-400 animate-pulse">
            좌표를 불러오는 중...
          </p>
        )}

        {geocodeError && (
          <p className="text-xs text-red-400">{geocodeError}</p>
        )}
      </div>

      {/* 좌표 (자동 입력 + 수동 수정 가능) */}
      <div className="flex flex-col gap-2 pt-2">
        <p className="text-xs text-gray-400">
          주소 검색 시 좌표가 자동으로 입력됩니다. 필요하면 직접 수정할 수 있습니다.
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
