import type { MetadataRoute } from "next";

export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "PDF Toolkit",
    short_name: "PDF Toolkit",
    description: "PDF 합치기, 나누기, 변환 및 페이지 정리 도구",
    start_url: "/",
    display: "standalone",
    background_color: "#f6f8fb",
    theme_color: "#f6f8fb",
    orientation: "portrait"
  };
}
