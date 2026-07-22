import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { InfoPage } from "@/components/InfoPage";
import { APP_VERSION } from "@/config/site";

export const metadata = {
  title: "변경 내역",
  description: "PDF Toolkit 웹과 데스크톱 앱의 버전별 변경 내역입니다.",
  alternates: { canonical: "/changelog" }
};

export default function ChangelogPage() {
  return (
    <AppShell>
      <InfoPage eyebrow="Release notes" title="변경 내역" intro="실제로 완료하고 검증한 변경 사항만 기록합니다.">
        <section>
          <p className="version-label">v{APP_VERSION} · 초기 데스크톱 토대</p>
          <h2>Windows 앱 준비</h2>
          <ul>
            <li>Tauri 기반 Windows 데스크톱 앱 구성과 로컬 정적 프런트엔드 빌드 추가</li>
            <li>웹과 동일한 여섯 가지 PDF 처리 도구 재사용</li>
            <li>데스크톱 다운로드 안내, 버전 관리 및 릴리스 문서 추가</li>
            <li>데스크톱 앱의 외부 링크를 시스템 기본 브라우저에서 안전하게 열도록 처리</li>
          </ul>
          <p>공개 설치 파일은 검증과 서명 전까지 제공하지 않습니다. 현재 상태는 <Link href="/download">다운로드 페이지</Link>에서 확인할 수 있습니다.</p>
        </section>
      </InfoPage>
    </AppShell>
  );
}
