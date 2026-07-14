"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Clock3,
  FileText,
  Home,
  LayoutGrid,
  Settings
} from "lucide-react";
import { tools } from "@/config/tools";

const utilityNavigation = [
  { href: "/#recent", label: "최근 작업", icon: Clock3 },
  { href: "/#settings", label: "설정", icon: Settings }
];

const mobileNavigation = [
  { href: "/", label: "홈", icon: Home },
  { href: "/#tools", label: "도구", icon: LayoutGrid },
  { href: "/#recent", label: "최근", icon: Clock3 },
  { href: "/#settings", label: "설정", icon: Settings }
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="app-shell">
      <aside className="shell-sidebar" aria-label="주요 내비게이션">
        <Link href="/" className="sidebar-brand" aria-label="PDF Toolkit 홈">
          <span className="brand-mark">
            <FileText size={20} aria-hidden="true" />
          </span>
          <span className="sidebar-label">PDF Toolkit</span>
        </Link>

        <nav className="sidebar-navigation">
          <div className="sidebar-group">
            <SidebarLink href="/" label="홈" icon={Home} pathname={pathname} />
          </div>

          <div className="sidebar-group">
            <span className="sidebar-group-label">PDF 도구</span>
            {tools.map((tool) => (
              <SidebarLink
                key={tool.id}
                href={tool.route}
                label={tool.name}
                icon={tool.icon}
                pathname={pathname}
              />
            ))}
          </div>

          <div className="sidebar-group sidebar-utility-group">
            {utilityNavigation.map((item) => (
              <SidebarLink key={item.href} {...item} pathname={pathname} />
            ))}
          </div>
        </nav>
      </aside>

      <header className="shell-header">
        <Link href="/" className="mobile-brand" aria-label="PDF Toolkit 홈">
          <span className="brand-mark">
            <FileText size={19} aria-hidden="true" />
          </span>
          <span>PDF Toolkit</span>
        </Link>
        <div className="desktop-header-copy">
          <strong>PDF Toolkit</strong>
          <span>합치기, 나누기, 변환, 페이지 정리</span>
        </div>
        <Link href="/#tools" className="header-tools-link">
          <LayoutGrid size={16} aria-hidden="true" />
          PDF 도구
        </Link>
      </header>

      <main className="shell-main">
        <div className="workspace">{children}</div>
      </main>

      <nav className="bottom-nav" aria-label="모바일 주요 내비게이션">
        {mobileNavigation.map((item) => {
          const Icon = item.icon;
          const isActive = getIsActive(item.href, pathname);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={isActive ? "is-active" : undefined}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon size={19} aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

function SidebarLink({
  href,
  label,
  icon: Icon,
  pathname
}: {
  href: string;
  label: string;
  icon: typeof Home;
  pathname: string;
}) {
  const isActive = getIsActive(href, pathname);

  return (
    <Link
      href={href}
      className={`sidebar-link${isActive ? " is-active" : ""}`}
      aria-current={isActive ? "page" : undefined}
      title={label}
    >
      <Icon size={19} aria-hidden="true" />
      <span className="sidebar-label">{label}</span>
    </Link>
  );
}

function getIsActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname === href;
}
