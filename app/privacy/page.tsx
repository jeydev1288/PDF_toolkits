import Link from "next/link";
import { AppShell } from "@/components/AppShell";
import { InfoPage } from "@/components/InfoPage";
import { CONTACT_EMAIL } from "@/config/site";

export const metadata = { title: "개인정보 처리 안내", description: "PDF Toolkit의 파일 처리, 저장, 삭제 및 개인정보 보호 방식을 안내합니다.", alternates: { canonical: "/privacy" } };

export default function PrivacyPage() {
  return <AppShell><InfoPage eyebrow="개인정보 보호" title="개인정보 처리 안내" intro="PDF Toolkit은 파일을 서버에 업로드하지 않는 브라우저 내 처리 방식을 사용합니다.">
    <section><h2>파일 처리 정책</h2><div className="policy-table" role="table" aria-label="파일 처리 정책"><PolicyRow label="처리 목적">PDF 병합, 분할, 페이지 정리, 이미지 변환 및 다시 저장</PolicyRow><PolicyRow label="저장 여부">선택한 파일과 결과 파일은 서버 메모리, 임시 디스크, 데이터베이스에 저장되지 않습니다. 현재 브라우저 메모리에서만 처리됩니다.</PolicyRow><PolicyRow label="삭제 시점">브라우저 탭을 닫거나 새 작업을 시작하면 브라우저 메모리의 작업 데이터가 해제됩니다. 다운로드한 결과는 이용자의 기기에 남습니다.</PolicyRow><PolicyRow label="작업 기록">서버에 작업 기록을 저장하지 않습니다. 파일 이름과 파일 내용도 전송하거나 기록하지 않습니다.</PolicyRow><PolicyRow label="분석 도구">현재 방문 분석·광고·사용자 추적 도구를 사용하지 않습니다.</PolicyRow><PolicyRow label="문의처"><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></PolicyRow><PolicyRow label="금지 파일">불법 자료, 타인의 권리를 침해하는 자료, 민감한 인증 정보 또는 처리 권한이 없는 파일은 이용하지 마세요.</PolicyRow></div></section>
    <section><h2>브라우저에 남는 정보</h2><p>이 서비스는 계정, 쿠키 기반 작업 이력, 최근 파일 목록을 만들지 않습니다. 브라우저가 다운로드 기록을 자체적으로 보관할 수 있으며 이는 브라우저 설정에서 관리할 수 있습니다.</p></section>
    <section><h2>제3자 제공과 국외 이전</h2><p>파일이나 작업 정보를 수집하지 않으므로 제3자에게 제공하거나 국외로 이전하지 않습니다. 웹 호스팅 과정에서 일반적인 접속 로그가 인프라 제공자에 의해 처리될 수 있으나, 서비스 코드는 파일 이름이나 파일 내용을 로그에 포함하지 않습니다.</p></section>
    <section><h2>문의</h2><p>개인정보 또는 파일 처리 방식에 관한 질문은 <Link href="/contact">문의 페이지</Link>에서 보내 주세요.</p></section>
  </InfoPage></AppShell>;
}

function PolicyRow({ label, children }: { label: string; children: React.ReactNode }) { return <div className="policy-row" role="row"><strong role="rowheader">{label}</strong><span role="cell">{children}</span></div>; }
