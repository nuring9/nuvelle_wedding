import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="text-2xl font-display font-semibold text-gray-800 tracking-widest"
        >
          Nuvelle
        </Link>
        <p className="text-xs text-gray-400 mt-1 tracking-wide">
          감각적인 모바일 청첩장
        </p>
      </div>
      <div className="w-full max-w-sm card-base p-8">{children}</div>
    </div>
  );
}
