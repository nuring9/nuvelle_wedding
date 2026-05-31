import type { Metadata } from "next";
import "./globals.css";
import AuthProvider from "@/components/common/AuthProvider";
import DialogProvider from "@/components/common/DialogProvider";

export const metadata: Metadata = {
  title: {
    default: "Nuvelle Wedding",
    template: "%s | Nuvelle Wedding",
  },
  description: "감각적인 모바일 청첩장을 직접 만들고 공유하세요.",
  keywords: ["모바일 청첩장", "청첩장", "웨딩", "Nuvelle"],
  icons: {
    icon: "/icon.svg",
  },
  openGraph: {
    title: "Nuvelle Wedding",
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
        <AuthProvider>
          <DialogProvider>{children}</DialogProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
