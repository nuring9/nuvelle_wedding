import type { PublicInvitation } from "@/types/invitation";

interface InvitationMapSectionProps {
  invitation: PublicInvitation;
}

export default function InvitationMapSection({
  invitation,
}: InvitationMapSectionProps) {
  if (!invitation.mapLat || !invitation.mapLng) return null;

  const kakaoMapUrl = `https://map.kakao.com/link/map/${invitation.venueName},${invitation.mapLat},${invitation.mapLng}`;
  const naverMapUrl = `https://map.naver.com/v5/search/${encodeURIComponent(invitation.venueAddress || invitation.venueName || "")}`;

  return (
    <section className="section-padding bg-gray-50">
      <h2 className="text-xs tracking-widest text-gray-400 mb-8 uppercase text-center">
        Location
      </h2>

      {/* 지도 iframe */}
      <div className="w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 bg-gray-200">
        <iframe
          src={`https://map.kakao.com/link/embed/${invitation.venueName},${invitation.mapLat},${invitation.mapLng}`}
          className="w-full h-full border-0"
          title="예식장 지도"
        />
      </div>

      {/* 장소 정보 */}
      {invitation.venueName && (
        <div className="text-center mb-6">
          <p className="text-sm font-medium text-gray-800 mb-1">
            {invitation.venueName}
          </p>
          {invitation.venueAddress && (
            <p className="text-xs text-gray-500">{invitation.venueAddress}</p>
          )}
        </div>
      )}

      {/* 오시는 길 */}
      {invitation.transportInfo && (
        <div className="bg-white rounded-xl p-4 mb-6">
          <p className="text-xs font-medium text-gray-600 mb-2">오시는 길</p>
          <p className="text-xs text-gray-500 leading-relaxed whitespace-pre-line">
            {invitation.transportInfo}
          </p>
        </div>
      )}

      {/* 지도 앱 연결 버튼 */}
      <div className="flex gap-2">
        <a
          href={kakaoMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs py-3 rounded-xl border border-yellow-400 text-yellow-600 hover:bg-yellow-50 transition-colors font-medium"
        >
          카카오맵
        </a>
        <a
          href={naverMapUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-center text-xs py-3 rounded-xl border border-green-400 text-green-600 hover:bg-green-50 transition-colors font-medium"
        >
          네이버지도
        </a>
      </div>
    </section>
  );
}
