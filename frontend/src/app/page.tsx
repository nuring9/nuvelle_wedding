import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
      {/* 브랜드 로고 영역 */}
      <div className="text-center mb-8 animate-fade-in">
        <h1 className="text-4xl font-display font-semibold text-gray-800 tracking-widest mb-1">
          Nuvelle
        </h1>
        <p className="text-gray-500 text-sm tracking-wide">
          감각적인 모바일 청첩장
        </p>
      </div>

      {/* 메인 카피 */}
      <div className="text-center mb-6 animate-slide-up">
        <h2 className="text-2xl font-serif text-gray-800 mb-4 leading-relaxed">
          우리의 특별한 날을
          <br />
          가장 아름답게 전하세요
        </h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          직접 만들고, 바로 공유하는
          <br />
          나만의 모바일 청첩장
        </p>
      </div>

      {/* CTA 버튼 */}
      <div className="flex flex-col gap-3 w-full max-w-xs animate-slide-up">
        <Link
          href="/templates"
          className="btn-primary text-center py-4 text-base"
        >
          청첩장 만들기
        </Link>
        <Link
          href="/login"
          className="btn-secondary text-center py-4 text-base"
        >
          로그인
        </Link>
      </div>

      {/* 하단 부가 서비스 링크 */}
      <div className="mt-6 text-center">
        <Link
          href="/honeymoon"
          className="text-gray-400 text-xs underline underline-offset-4 hover:text-gray-600 transition-colors"
        >
          신혼여행 추천 보러가기
        </Link>
      </div>
    </main>
  );
}
