import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_NAME } from "@/config/site";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://pdftoolkit.kr"),
  title: {
    default: "무료 PDF 도구 – 합치기, 나누기, 변환",
    template: `%s | ${SITE_NAME}`
  },
  description: "PDF 병합, 분할, 페이지 순서 변경과 이미지 변환을 설치 없이 무료로 처리하세요.",
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default"
  },
  formatDetection: {
    telephone: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#f6f8fb",
  viewportFit: "cover"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}
