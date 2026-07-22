import Link from "next/link";
import { CheckCircle2, Download, Laptop, MonitorCog, PackageCheck, Wrench } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { APP_VERSION, WINDOWS_INSTALLER_URL } from "@/config/site";

export const metadata = {
  title: "PDF Toolkit 데스크톱 앱",
  description: "PDF Toolkit Windows 데스크톱 앱의 현재 지원 상태, 설치 방법과 시스템 요구사항을 확인하세요.",
  alternates: { canonical: "/download" }
};

export default function DownloadPage() {
  const windowsAvailable = Boolean(WINDOWS_INSTALLER_URL);

  return (
    <AppShell>
      <article className="download-page">
        <header className="download-hero">
          <p className="eyebrow">Desktop app · v{APP_VERSION}</p>
          <h1>PDF Toolkit for Desktop</h1>
          <p>익숙한 PDF 도구를 Windows 앱 창에서 사용할 수 있도록 준비하고 있습니다. PDF 처리는 웹과 동일하게 기기 안에서 실행됩니다.</p>
          <div className="desktop-status" role="status">
            <Wrench size={18} aria-hidden="true" />
            <span><strong>Windows build in testing</strong> — 공개 설치 파일은 아직 제공하지 않습니다.</span>
          </div>
        </header>

        <section aria-labelledby="platforms-title">
          <div className="section-heading"><div><p className="eyebrow">지원 플랫폼</p><h2 id="platforms-title">현재 제공 상태</h2></div></div>
          <div className="platform-grid">
            <article className="platform-card is-primary">
              <MonitorCog size={26} aria-hidden="true" />
              <span className={`platform-badge ${windowsAvailable ? "is-available" : ""}`}>{windowsAvailable ? "Available" : "Testing"}</span>
              <h3>Windows</h3>
              <p>Windows 10·11 64비트 환경을 우선 지원합니다.</p>
              {windowsAvailable ? (
                <a className="button platform-download" href={WINDOWS_INSTALLER_URL ?? undefined}>
                  <Download size={18} aria-hidden="true" />Windows용 다운로드
                </a>
              ) : (
                <span className="platform-placeholder" aria-label="Windows 설치 파일 준비 중">Windows build in testing</span>
              )}
            </article>
            <article className="platform-card"><Laptop size={26} aria-hidden="true" /><span className="platform-badge">Coming Soon</span><h3>macOS</h3><p>현재 동작하는 빌드가 없어 지원 플랫폼으로 표시하지 않습니다.</p></article>
            <article className="platform-card"><Laptop size={26} aria-hidden="true" /><span className="platform-badge">Coming Soon</span><h3>Linux</h3><p>현재 동작하는 빌드가 없어 지원 플랫폼으로 표시하지 않습니다.</p></article>
          </div>
        </section>

        <div className="download-details-grid">
          <section><PackageCheck size={22} aria-hidden="true" /><h2>시스템 요구사항</h2><ul><li>Windows 10 또는 11, 64비트</li><li>Microsoft Edge WebView2 Runtime</li><li>메모리 4GB 이상 권장</li><li>설치와 업데이트를 위한 여유 공간</li></ul></section>
          <section><CheckCircle2 size={22} aria-hidden="true" /><h2>설치 방법</h2><ol><li>공식 GitHub Release의 설치 파일을 받습니다.</li><li>다운로드한 설치 프로그램을 실행합니다.</li><li>화면 안내에 따라 설치한 뒤 PDF Toolkit을 엽니다.</li></ol></section>
        </div>

        <section className="connection-notice"><h2>인터넷 연결이 필요한가요?</h2><p>설치 파일 다운로드에는 인터넷이 필요합니다. 설치 후 PDF 병합, 분할, 페이지 정리, 이미지 변환과 다시 저장은 앱에 포함된 코드로 로컬 처리되도록 설계했습니다. 분석 이벤트 전송에 실패해도 PDF 작업에는 영향을 주지 않습니다.</p></section>
        <p className="download-links"><Link href="/changelog">변경 내역 보기</Link><span aria-hidden="true">·</span><Link href="/privacy">파일 처리 정책</Link></p>
      </article>
    </AppShell>
  );
}
