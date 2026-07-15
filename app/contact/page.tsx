import { Bug, Lightbulb, Mail } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { InfoPage } from "@/components/InfoPage";
import { CONTACT_EMAIL } from "@/config/site";

export const metadata = { title: "문의·피드백", description: "PDF Toolkit 오류를 제보하거나 새로운 PDF 기능을 요청하세요.", alternates: { canonical: "/contact" } };

export default function ContactPage() {
  const errorMail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[PDF Toolkit 오류 제보]")}`;
  const featureMail = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("[PDF Toolkit 기능 요청]")}`;
  return <AppShell><InfoPage eyebrow="도움말" title="문의·피드백" intro="오류를 발견했거나 필요한 기능이 있다면 알려 주세요.">
    <section id="feedback"><h2>어떤 의견을 보내시겠어요?</h2><div className="feedback-options"><a href={errorMail}><Bug size={22} aria-hidden="true" /><span><strong>오류 제보</strong><small>사용한 도구, 브라우저와 오류 상황을 적어 주세요. 실제 파일이나 파일 이름은 보내지 마세요.</small></span></a><a href={featureMail}><Lightbulb size={22} aria-hidden="true" /><span><strong>기능 요청</strong><small>필요한 PDF 작업과 기대하는 결과를 알려 주세요.</small></span></a></div></section>
    <section><h2>이메일 문의</h2><p className="contact-email"><Mail size={19} aria-hidden="true" /><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p><p>문의 메일은 답변과 문제 해결 목적으로만 사용합니다. 주민등록번호, 계정 비밀번호, 인증서 등 민감한 정보와 원본 문서를 첨부하지 마세요.</p></section>
  </InfoPage></AppShell>;
}
