"use client";

import { useEffect, useRef, useState } from "react";

// InvitationBgmPlayer 컴포넌트가 받는 props 타입
interface InvitationBgmPlayerProps {
  // 재생할 BGM 파일 URL
  bgmUrl: string;
}

export default function InvitationBgmPlayer({
  bgmUrl,
}: InvitationBgmPlayerProps) {
  // audio 태그 DOM에 접근하기 위한 ref
  const audioRef = useRef<HTMLAudioElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // 컴포넌트가 렌더링되면 자동 재생을 시도한다.
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));

    // 컴포넌트가 사라질 때 음악을 정지한다.
    return () => {
      audio.pause();
    };
  }, [bgmUrl]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      // 현재 재생 중이면 음악을 정지한다.
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  };

  return (
    <div className="fixed bottom-6 right-4 z-40">
      <audio ref={audioRef} src={bgmUrl} loop />

      <button
        type="button"
        // 버튼 클릭 시 재생/정지 전환
        onClick={togglePlay}
        className="w-10 h-10 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
      >
        {isPlaying ? (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  );
}
