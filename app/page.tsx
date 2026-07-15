import { AppShell } from "@/components/AppShell";
import { HomeDashboard } from "@/components/HomeDashboard";

export const metadata = {
  title: "무료 PDF 도구 – 합치기, 나누기, 변환",
  description: "PDF 병합, 분할, 페이지 순서 변경과 이미지 변환을 설치 없이 브라우저에서 무료로 처리하세요.",
  alternates: { canonical: "/" }
};

export default function HomePage() {
  return (
    <AppShell>
      <HomeDashboard />
    </AppShell>
  );
}
