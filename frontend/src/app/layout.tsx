import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/common/AuthProvider";

export const metadata: Metadata = {
  title: {
    default: "Nuvelle | 모바일 청첩장",
    template: "%s | Nuvelle",
  },
  description: "감각적인 모바일 청첩장을 직접 만들고 공유하세요.",
  keywords: ["모바일 청첩장", "청첩장", "웨딩", "Nuvelle"],
  openGraph: {
    title: "Nuvelle | 모바일 청첩장",
    description: "감각적인 모바일 청첩장을 직접 만들고 공유하세요.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
