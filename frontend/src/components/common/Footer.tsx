import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-gray-100 bg-white">
      <div className="mx-auto flex max-w-screen-lg flex-col gap-8 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <Link
            href="/"
            className="font-display text-xl font-semibold tracking-widest text-gray-800"
          >
            Nuvelle
          </Link>
          <p className="mt-3 max-w-xs text-sm leading-6 text-gray-500">
            감각적인 모바일 청첩장을 만들고, 예식 정보와 추억을 손쉽게
            공유하세요.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 text-sm sm:grid-cols-3 sm:gap-12">
          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Service
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/templates" className="text-gray-500 hover:text-gray-800">
                템플릿
              </Link>
              <Link href="/invitations" className="text-gray-500 hover:text-gray-800">
                내 청첩장
              </Link>
              <Link href="/honeymoon" className="text-gray-500 hover:text-gray-800">
                신혼여행 플래너
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Account
            </h2>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="text-gray-500 hover:text-gray-800">
                로그인
              </Link>
              <Link href="/signup" className="text-gray-500 hover:text-gray-800">
                회원가입
              </Link>
            </div>
          </div>

          <div>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-widest text-gray-400">
              Info
            </h2>
            <div className="flex flex-col gap-2 text-gray-500">
              <span>nuvelle@example.com</span>
              <span>평일 10:00-18:00</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100 px-4 py-4">
        <p className="mx-auto max-w-screen-lg text-xs text-gray-400">
          © {year} Nuvelle. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
