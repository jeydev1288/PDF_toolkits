import { HeartHandshake, LockKeyhole, Sparkles } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { InfoPage } from "@/components/InfoPage";

export const metadata = {
  title: "서비스 소개",
  description: "PDF Toolkit이 누구나 쉽고 안전하게 PDF 작업을 처리할 수 있도록 만드는 원칙을 소개합니다.",
  alternates: { canonical: "/about" }
};

const principles = [
  { icon: Sparkles, title: "쉬운 사용", description: "처음 방문한 사람도 설명서를 읽지 않고 파일 선택부터 다운로드까지 완료할 수 있어야 합니다." },
  { icon: LockKeyhole, title: "개인정보 우선", description: "PDF와 이미지는 서버로 보내지 않고 이용자의 브라우저 안에서 처리합니다." },
  { icon: HeartHandshake, title: "정직한 제품", description: "실제 제공하는 기능과 한도, 파일 처리 방식을 이해하기 쉬운 언어로 정확히 안내합니다." }
];

export default function AboutPage() {
  return (
    <AppShell>
      <InfoPage eyebrow="About PDF Toolkit" title="복잡한 PDF 작업을 누구나 쉽게" intro="PDF Toolkit은 자주 필요한 문서 작업을 빠르고 안전하게 끝낼 수 있도록 만든 무료 브라우저 도구입니다.">
        <section>
          <h2>우리가 만드는 제품</h2>
          <p>별도 프로그램, 계정, 학습 과정 없이 필요한 도구를 선택하고 파일을 처리한 뒤 결과를 바로 받을 수 있는 경험을 만듭니다. 현재 제공하는 핵심 기능에 집중하고, 속도와 신뢰를 해치는 불필요한 요소는 줄입니다.</p>
        </section>
        <section>
          <h2>제품 원칙</h2>
          <div className="about-principles">
            {principles.map(({ icon: Icon, title, description }) => (
              <article key={title}><Icon size={22} aria-hidden="true" /><h3>{title}</h3><p>{description}</p></article>
            ))}
          </div>
        </section>
        <section>
          <h2>파일 처리 방식</h2>
          <p>파일 작업은 브라우저 메모리에서 실행됩니다. 파일 이름과 내용은 분석 이벤트에 포함되지 않으며, 결과 파일도 서버에 보관하지 않습니다.</p>
        </section>
      </InfoPage>
    </AppShell>
  );
}
