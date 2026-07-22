"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CircleUserRound, Download, FileText, Home, LayoutGrid, MessageSquareText, ShieldCheck } from "lucide-react";
import { tools } from "@/config/tools";

const mobileNavigation = [
  { href: "/", label: "홈", icon: Home },
  { href: "/#all-tools", label: "도구", icon: LayoutGrid },
  { href: "/privacy", label: "보안", icon: ShieldCheck },
  { href: "/contact", label: "피드백", icon: MessageSquareText }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="shell-sidebar" aria-label="주요 내비게이션">
        <Link href="/" className="sidebar-brand" aria-label="PDF Toolkit 홈"><span className="brand-mark"><FileText size={20} aria-hidden="true" /></span><span className="sidebar-label">PDF Toolkit</span></Link>
        <nav className="sidebar-navigation">
          <div className="sidebar-group"><SidebarLink href="/" label="홈" icon={Home} pathname={pathname} /></div>
          <div className="sidebar-group"><span className="sidebar-group-label">PDF 도구</span>{tools.map((tool) => <SidebarLink key={tool.id} href={tool.route} label={tool.name} icon={tool.icon} pathname={pathname} />)}</div>
          <div className="sidebar-group sidebar-utility-group"><SidebarLink href="/download" label="데스크톱 앱" icon={Download} pathname={pathname} /><SidebarLink href="/about" label="서비스 소개" icon={CircleUserRound} pathname={pathname} /><SidebarLink href="/privacy" label="개인정보 처리 안내" icon={ShieldCheck} pathname={pathname} /><SidebarLink href="/contact" label="오류 제보·기능 요청" icon={MessageSquareText} pathname={pathname} /></div>
        </nav>
      </aside>

      <header className="shell-header">
        <Link href="/" className="mobile-brand" aria-label="PDF Toolkit 홈"><span className="brand-mark"><FileText size={19} aria-hidden="true" /></span><span>PDF Toolkit</span></Link>
        <div className="desktop-header-copy"><strong>PDF Toolkit</strong><span>파일을 서버에 올리지 않는 무료 PDF 도구</span></div>
        <div className="header-actions"><Link href="/#all-tools" className="header-tools-link"><LayoutGrid size={16} aria-hidden="true" />PDF 도구</Link><Link href="/contact" className="header-feedback-link"><MessageSquareText size={16} aria-hidden="true" />오류 제보·기능 요청</Link></div>
      </header>

      <main className="shell-main"><div className="workspace">{children}</div></main>
      <footer className="site-footer"><span>© {new Date().getFullYear()} PDF Toolkit</span><nav aria-label="정책 링크"><Link href="/download">데스크톱 앱</Link><Link href="/about">서비스 소개</Link><Link href="/privacy">개인정보 처리 안내</Link><Link href="/terms">이용약관</Link><Link href="/contact">문의</Link></nav></footer>
      <Link href="/contact#feedback" className="floating-feedback"><MessageSquareText size={18} aria-hidden="true" /><span>피드백</span></Link>

      <nav className="bottom-nav" aria-label="모바일 주요 내비게이션">{mobileNavigation.map((item) => { const Icon = item.icon; const isActive = getIsActive(item.href, pathname); return <Link key={item.href} href={item.href} className={isActive ? "is-active" : undefined} aria-current={isActive ? "page" : undefined}><Icon size={19} aria-hidden="true" /><span>{item.label}</span></Link>; })}</nav>
    </div>
  );
}

function SidebarLink({ href, label, icon: Icon, pathname }: { href: string; label: string; icon: typeof Home; pathname: string }) {
  const isActive = getIsActive(href, pathname);
  return <Link href={href} className={`sidebar-link${isActive ? " is-active" : ""}`} aria-current={isActive ? "page" : undefined} title={label}><Icon size={19} aria-hidden="true" /><span className="sidebar-label">{label}</span></Link>;
}

function getIsActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href;
}
