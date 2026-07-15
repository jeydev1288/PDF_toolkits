import Link from "next/link";
import {
  ArrowRight,
  Check,
  FileCheck2,
  Gauge,
  LockKeyhole,
  MonitorSmartphone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { toolCategories, tools } from "@/config/tools";

const advantages = [
  { icon: Sparkles, title: "설치 없이 바로", description: "프로그램이나 확장 기능을 설치하지 않고 브라우저에서 바로 시작합니다." },
  { icon: MonitorSmartphone, title: "모바일·PC 지원", description: "휴대폰, 태블릿, PC의 최신 브라우저에서 같은 도구를 사용할 수 있습니다." },
  { icon: LockKeyhole, title: "파일은 기기 안에서", description: "선택한 파일을 서버로 업로드하지 않고 현재 브라우저에서 처리합니다." },
  { icon: Gauge, title: "넉넉한 무료 한도", description: "파일당 20MB, 한 작업당 전체 50MB까지 무료로 처리할 수 있습니다." }
];

const faqs = [
  ["정말 무료인가요?", "현재 제공되는 모든 PDF 도구는 로그인이나 결제 없이 무료로 사용할 수 있습니다."],
  ["파일이 서버에 저장되나요?", "아니요. 파일 처리 코드는 브라우저에서 실행되며 파일 내용과 파일 이름을 서버로 전송하지 않습니다."],
  ["업로드할 수 있는 파일 크기는 얼마인가요?", "개별 파일은 20MB, 한 작업에 선택하는 전체 파일은 50MB까지입니다. 도구별 파일 개수 제한도 적용됩니다."],
  ["처리한 파일은 어디에서 받나요?", "작업이 끝나면 결과 카드의 다운로드 버튼으로 즉시 저장할 수 있습니다."],
  ["민감한 문서를 처리해도 되나요?", "파일은 기기 안에서 처리되지만, 공용 기기에서는 민감한 인증 정보나 불법 자료를 다루지 않는 것을 권장합니다."]
];

export function HomeDashboard() {
  const featuredTools = tools.filter((tool) => tool.featured).slice(0, 3);

  return (
    <div className="sales-home">
      <section className="sales-hero" aria-labelledby="home-title">
        <div className="hero-copy">
          <p className="eyebrow">무료 온라인 PDF 도구</p>
          <h1 id="home-title">필요한 PDF 작업을 한곳에서 해결하세요</h1>
          <p className="hero-lead">PDF 병합, 분할, 페이지 순서 변경과 이미지 변환을 설치 없이 처리하세요.</p>
          <p className="hero-support">복잡한 프로그램 없이 파일을 선택하고 원하는 작업만 실행하면 됩니다.</p>
          <div className="hero-actions">
            <Link className="primary-link" href="/tools/merge-pdf">무료로 PDF 합치기 <ArrowRight size={18} aria-hidden="true" /></Link>
            <Link className="secondary-link" href="#all-tools">모든 도구 보기</Link>
          </div>
          <ul className="hero-trust" aria-label="서비스 특징">
            {["설치 필요 없음", "모바일·PC 지원", "처리 완료 후 파일을 보관하지 않음"].map((item) => (
              <li key={item}><Check size={17} aria-hidden="true" />{item}</li>
            ))}
          </ul>
        </div>
        <div className="hero-visual" aria-hidden="true">
          <div className="hero-file-card"><FileCheck2 size={34} /><strong>PDF 작업 준비 완료</strong><span>파일 선택 · 작업 실행 · 다운로드</span></div>
          <div className="hero-security-badge"><ShieldCheck size={18} /> 서버 업로드 없음</div>
        </div>
      </section>

      <section className="home-section" aria-labelledby="popular-title">
        <SectionHeading eyebrow="가장 많이 찾는 기능" title="자주 쓰는 도구" id="popular-title" />
        <div className="quick-actions three-columns">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;
            return <Link key={tool.id} href={tool.route} className="quick-action"><span className="tool-icon"><Icon size={21} aria-hidden="true" /></span><span><strong>{tool.name}</strong><small>{tool.description}</small></span><ArrowRight size={18} aria-hidden="true" /></Link>;
          })}
        </div>
      </section>

      <section className="home-section" id="all-tools" aria-labelledby="all-tools-title">
        <SectionHeading eyebrow="6가지 무료 기능" title="전체 PDF 도구" id="all-tools-title" />
        <div className="tool-category-list">
          {toolCategories.map((category) => (
            <div className="tool-category" key={category}>
              <h3>{category}</h3>
              <div className="tool-grid">{tools.filter((tool) => tool.category === category).map((tool) => <ToolCard key={tool.id} tool={tool} />)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-section" aria-labelledby="advantages-title">
        <SectionHeading eyebrow="PDF Toolkit을 선택하는 이유" title="빠르고 안전한 무료 PDF 작업" id="advantages-title" />
        <div className="advantage-grid">{advantages.map(({ icon: Icon, title, description }) => <article className="advantage-card" key={title}><span><Icon size={22} aria-hidden="true" /></span><h3>{title}</h3><p>{description}</p></article>)}</div>
      </section>

      <section className="processing-guide" aria-labelledby="processing-title">
        <div><p className="eyebrow">파일 처리 안내</p><h2 id="processing-title">파일은 브라우저에서만 처리됩니다</h2><p>선택한 PDF와 이미지는 서버, 임시 디스크, 데이터베이스로 전송되지 않습니다. 처리 결과도 현재 탭에서 직접 만들어 다운로드합니다.</p></div>
        <ol><li><strong>1</strong><span>파일 선택<small>기기에서 파일을 선택합니다.</small></span></li><li><strong>2</strong><span>브라우저 처리<small>파일이 기기 안에서 변환됩니다.</small></span></li><li><strong>3</strong><span>즉시 다운로드<small>결과 파일을 바로 저장합니다.</small></span></li></ol>
        <Link href="/privacy">개인정보 처리 안내 보기 <ArrowRight size={16} aria-hidden="true" /></Link>
      </section>

      <section className="home-section faq-section" aria-labelledby="faq-title">
        <SectionHeading eyebrow="자주 묻는 질문" title="PDF 도구 이용 안내" id="faq-title" />
        <div className="faq-list">{faqs.map(([question, answer]) => <details key={question}><summary>{question}</summary><p>{answer}</p></details>)}</div>
      </section>
    </div>
  );
}

function SectionHeading({ eyebrow, title, id }: { eyebrow: string; title: string; id: string }) {
  return <div className="home-section-heading"><p className="eyebrow">{eyebrow}</p><h2 id={id}>{title}</h2></div>;
}
