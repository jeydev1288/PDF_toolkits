import { AppShell } from "@/components/AppShell";
import { InfoPage } from "@/components/InfoPage";
import { CONTACT_EMAIL, MAX_FILE_BYTES, MAX_TOTAL_BYTES, formatMegabytes } from "@/config/site";

export const metadata = { title: "이용약관", description: "PDF Toolkit 무료 PDF 도구의 이용 조건과 제한을 안내합니다.", alternates: { canonical: "/terms" } };

export default function TermsPage() {
  return <AppShell><InfoPage eyebrow="서비스 정책" title="이용약관" intro="PDF Toolkit을 이용하면 아래 조건에 동의한 것으로 봅니다.">
    <section><h2>서비스 제공</h2><p>PDF Toolkit은 설치 없이 브라우저에서 실행되는 PDF 편집·변환 도구를 제공합니다. 현재 별도의 회원가입, 결제, 하루 작업 횟수 제한은 없습니다.</p></section>
    <section><h2>무료 이용 한도</h2><ul><li>개별 파일: {formatMegabytes(MAX_FILE_BYTES)} 이하</li><li>한 작업의 전체 파일: {formatMegabytes(MAX_TOTAL_BYTES)} 이하</li><li>파일 수: PDF 합치기 20개, 이미지→PDF 30개, 단일 파일 도구 1개</li></ul><p>기기 성능이나 브라우저 메모리에 따라 한도 안의 작업도 느리거나 실패할 수 있습니다.</p></section>
    <section><h2>이용자 책임</h2><p>이용자는 파일을 처리할 적법한 권한을 보유해야 합니다. 불법 자료, 악성 파일, 타인의 권리를 침해하는 자료, 민감한 인증 정보를 처리해서는 안 됩니다.</p></section>
    <section><h2>결과와 책임 제한</h2><p>서비스는 가능한 범위에서 정확한 결과를 제공하지만 모든 PDF 형식, 손상 파일, 암호화 파일의 처리를 보장하지 않습니다. 중요한 문서는 원본을 보관하고 결과를 직접 확인해 주세요.</p></section>
    <section><h2>변경 및 문의</h2><p>기능이나 정책 변경 시 이 페이지의 업데이트 날짜를 변경합니다. 문의는 <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>로 보내 주세요.</p></section>
  </InfoPage></AppShell>;
}
