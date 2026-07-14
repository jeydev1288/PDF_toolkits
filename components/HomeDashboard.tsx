"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Clock3, HardDrive, Search, Settings } from "lucide-react";
import { EmptyState } from "@/components/EmptyState";
import { ToolCard } from "@/components/ToolCard";
import {
  getToolById,
  toolCategories,
  tools,
  type ToolConfig,
  type ToolId
} from "@/config/tools";

const RECENT_TOOLS_KEY = "pdf-toolkit:recent-tools";

export function HomeDashboard() {
  const [query, setQuery] = useState("");
  const [recentTools, setRecentTools] = useState<ToolConfig[]>([]);

  useEffect(() => {
    const updateRecentTools = () => {
      const ids = readRecentToolIds();
      setRecentTools(
        ids.map((id) => getToolById(id)).filter((tool): tool is ToolConfig => Boolean(tool))
      );
    };

    updateRecentTools();
    window.addEventListener("pdf-toolkit:recent-updated", updateRecentTools);
    return () => window.removeEventListener("pdf-toolkit:recent-updated", updateRecentTools);
  }, []);

  const filteredTools = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    if (!normalizedQuery) return tools;

    return tools.filter((tool) =>
      `${tool.name} ${tool.shortName} ${tool.description}`
        .toLocaleLowerCase()
        .includes(normalizedQuery)
    );
  }, [query]);

  const featuredTools = tools.filter((tool) => tool.featured);

  return (
    <div className="dashboard-page">
      <section className="dashboard-intro" aria-labelledby="dashboard-title">
        <div>
          <p className="eyebrow">PDF Toolkit</p>
          <h1 id="dashboard-title">PDF 작업을 빠르고 간단하게</h1>
          <p>PDF를 합치고, 나누고, 변환하고, 페이지를 정리하세요.</p>
        </div>
        <label className="tool-search">
          <Search size={20} aria-hidden="true" />
          <span className="sr-only">PDF 도구 검색</span>
          <input
            type="search"
            placeholder="PDF 도구 검색"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </section>

      <section className="dashboard-section" aria-labelledby="quick-actions-title">
        <SectionHeading eyebrow="빠른 시작" title="빠른 작업" id="quick-actions-title" />
        <div className="quick-actions four-columns">
          {featuredTools.map((tool) => {
            const Icon = tool.icon;

            return (
              <Link key={tool.id} href={tool.route} className="quick-action">
                <span className="tool-icon">
                  <Icon size={20} aria-hidden="true" />
                </span>
                <span>
                  <strong>{tool.name}</strong>
                  <small>{tool.description}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="dashboard-section" id="tools" aria-labelledby="all-tools-title">
        <SectionHeading
          eyebrow="전체 도구"
          title="PDF 도구"
          id="all-tools-title"
          meta={`${filteredTools.length}개`}
        />
        {filteredTools.length > 0 ? (
          <div className="tool-category-list">
            {toolCategories.map((category) => {
              const categoryTools = filteredTools.filter((tool) => tool.category === category);
              if (categoryTools.length === 0) return null;

              return (
                <div className="tool-category" key={category}>
                  <h3>{category}</h3>
                  <div className="tool-grid">
                    {categoryTools.map((tool) => (
                      <ToolCard key={tool.id} tool={tool} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Search}
            title="검색 결과가 없습니다"
            description="다른 도구 이름이나 작업으로 검색해 보세요."
          />
        )}
      </section>

      <section className="dashboard-section" id="recent" aria-labelledby="recent-title">
        <SectionHeading eyebrow="최근" title="최근 작업" id="recent-title" icon={Clock3} />
        {recentTools.length > 0 ? (
          <div className="recent-list">
            {recentTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link key={tool.id} href={tool.route} className="recent-row">
                  <span className="tool-icon compact-icon">
                    <Icon size={18} aria-hidden="true" />
                  </span>
                  <span>
                    <strong>{tool.name}</strong>
                    <small>{tool.description}</small>
                  </span>
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon={Clock3}
            title="최근 작업이 없습니다"
            description="도구를 사용하면 이 브라우저에 최근 사용한 도구가 표시됩니다."
          />
        )}
      </section>

      <section className="processing-notice" id="settings" aria-labelledby="settings-title">
        <span className="notice-icon">
          <HardDrive size={21} aria-hidden="true" />
        </span>
        <div>
          <p className="eyebrow">파일 처리 안내</p>
          <h2 id="settings-title">현재 처리 방식</h2>
          <p>
            선택한 파일은 작업 요청 시 서버로 전송되어 처리됩니다. 현재 구현에는 계정,
            파일 보관함 또는 서버에 저장되는 작업 기록 기능이 없습니다.
          </p>
        </div>
        <Settings size={19} aria-hidden="true" />
      </section>
    </div>
  );
}

function SectionHeading({
  eyebrow,
  title,
  id,
  meta,
  icon: Icon
}: {
  eyebrow: string;
  title: string;
  id: string;
  meta?: string;
  icon?: typeof Clock3;
}) {
  return (
    <div className="compact-section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={id}>{title}</h2>
      </div>
      {meta ? <span className="section-count">{meta}</span> : null}
      {Icon ? <Icon size={19} aria-hidden="true" /> : null}
    </div>
  );
}

function readRecentToolIds(): ToolId[] {
  try {
    const value = JSON.parse(localStorage.getItem(RECENT_TOOLS_KEY) ?? "[]") as string[];
    return value.filter((id): id is ToolId => Boolean(getToolById(id))).slice(0, 4);
  } catch {
    return [];
  }
}
