import {
  FileImage,
  Files,
  ImagePlus,
  ListOrdered,
  RefreshCw,
  Scissors,
  type LucideIcon
} from "lucide-react";

export type ToolCategory = "빠른 작업" | "변환" | "기타";
export type ToolId =
  | "merge-pdf"
  | "split-pdf"
  | "organize-pdf"
  | "pdf-to-image"
  | "image-to-pdf"
  | "resave-pdf";
export type ProcessorId =
  | "merge"
  | "split"
  | "reorder-pages"
  | "pdf-to-image"
  | "image-to-pdf"
  | "compress";

export type ToolOption = {
  id: string;
  label: string;
  type: "text" | "number" | "select";
  defaultValue: string;
  helper?: string;
  values?: Array<{ label: string; value: string }>;
};

export type ToolConfig = {
  id: ToolId;
  name: string;
  shortName: string;
  description: string;
  category: ToolCategory;
  route: string;
  icon: LucideIcon;
  featured: boolean;
  acceptedFileTypes: string[];
  processorId: ProcessorId;
  multiple: boolean;
  outputName: string;
  primaryAction: string;
  options?: ToolOption[];
};

export const toolCategories: ToolCategory[] = ["빠른 작업", "변환", "기타"];

export const tools: ToolConfig[] = [
  {
    id: "merge-pdf",
    name: "PDF 합치기",
    shortName: "합치기",
    description: "여러 PDF 파일을 하나로 결합합니다.",
    category: "빠른 작업",
    route: "/tools/merge-pdf",
    icon: Files,
    featured: true,
    acceptedFileTypes: ["application/pdf"],
    processorId: "merge",
    multiple: true,
    outputName: "merged.pdf",
    primaryAction: "PDF 합치기"
  },
  {
    id: "split-pdf",
    name: "PDF 나누기",
    shortName: "나누기",
    description: "PDF를 페이지 또는 범위별로 분리합니다.",
    category: "빠른 작업",
    route: "/tools/split-pdf",
    icon: Scissors,
    featured: true,
    acceptedFileTypes: ["application/pdf"],
    processorId: "split",
    multiple: false,
    outputName: "split-pages.zip",
    primaryAction: "PDF 나누기",
    options: [
      {
        id: "splitMode",
        label: "나누기 방식",
        type: "select",
        defaultValue: "every",
        values: [
          { label: "모든 페이지를 각각 분리", value: "every" },
          { label: "선택한 페이지만 추출", value: "extract" },
          { label: "페이지 범위별로 분리", value: "ranges" }
        ]
      },
      {
        id: "pageRange",
        label: "페이지 또는 범위",
        type: "text",
        defaultValue: "",
        helper: "예: 1-3, 5, 8-10"
      }
    ]
  },
  {
    id: "organize-pdf",
    name: "PDF 페이지 정리",
    shortName: "페이지 정리",
    description: "페이지 순서를 변경하고 회전하거나 삭제합니다.",
    category: "빠른 작업",
    route: "/tools/organize-pdf",
    icon: ListOrdered,
    featured: true,
    acceptedFileTypes: ["application/pdf"],
    processorId: "reorder-pages",
    multiple: false,
    outputName: "organized.pdf",
    primaryAction: "정리한 PDF 저장"
  },
  {
    id: "pdf-to-image",
    name: "PDF를 이미지로",
    shortName: "PDF → 이미지",
    description: "PDF 페이지를 PNG 또는 JPG로 변환합니다.",
    category: "변환",
    route: "/tools/pdf-to-image",
    icon: FileImage,
    featured: true,
    acceptedFileTypes: ["application/pdf"],
    processorId: "pdf-to-image",
    multiple: false,
    outputName: "pdf-images.zip",
    primaryAction: "이미지로 변환",
    options: [
      {
        id: "imageFormat",
        label: "이미지 형식",
        type: "select",
        defaultValue: "png",
        values: [
          { label: "PNG", value: "png" },
          { label: "JPG", value: "jpg" }
        ]
      },
      {
        id: "pageRange",
        label: "페이지 범위",
        type: "text",
        defaultValue: "",
        helper: "비워 두면 모든 페이지를 변환합니다."
      },
      {
        id: "imageQuality",
        label: "이미지 품질",
        type: "select",
        defaultValue: "90",
        values: [
          { label: "보통", value: "75" },
          { label: "높음", value: "90" },
          { label: "최고", value: "100" }
        ]
      }
    ]
  },
  {
    id: "image-to-pdf",
    name: "이미지를 PDF로",
    shortName: "이미지 → PDF",
    description: "여러 이미지를 하나의 PDF 파일로 만듭니다.",
    category: "변환",
    route: "/tools/image-to-pdf",
    icon: ImagePlus,
    featured: false,
    acceptedFileTypes: ["image/png", "image/jpeg"],
    processorId: "image-to-pdf",
    multiple: true,
    outputName: "images.pdf",
    primaryAction: "PDF 만들기",
    options: [
      {
        id: "pageSize",
        label: "페이지 크기",
        type: "select",
        defaultValue: "auto",
        values: [
          { label: "이미지에 맞춤", value: "auto" },
          { label: "A4", value: "a4" },
          { label: "Letter", value: "letter" }
        ]
      },
      {
        id: "orientation",
        label: "방향",
        type: "select",
        defaultValue: "portrait",
        values: [
          { label: "세로", value: "portrait" },
          { label: "가로", value: "landscape" }
        ]
      },
      {
        id: "margin",
        label: "여백",
        type: "select",
        defaultValue: "24",
        values: [
          { label: "없음", value: "0" },
          { label: "좁게", value: "12" },
          { label: "보통", value: "24" },
          { label: "넓게", value: "48" }
        ]
      }
    ]
  },
  {
    id: "resave-pdf",
    name: "PDF 다시 저장",
    shortName: "다시 저장",
    description: "PDF를 새 파일로 다시 생성합니다.",
    category: "기타",
    route: "/tools/resave-pdf",
    icon: RefreshCw,
    featured: false,
    acceptedFileTypes: ["application/pdf"],
    processorId: "compress",
    multiple: false,
    outputName: "resaved.pdf",
    primaryAction: "새 PDF로 저장"
  }
];

export function getToolById(id: string) {
  return tools.find((tool) => tool.id === id);
}

export function getToolByRouteSegment(segment: string) {
  return tools.find((tool) => tool.route === `/tools/${segment}`);
}

export function getToolByProcessorId(processorId: string) {
  return tools.find((tool) => tool.processorId === processorId);
}

export function getRelatedTools(toolId: ToolId, limit = 3) {
  const currentTool = getToolById(toolId);

  if (!currentTool) return [];

  return tools
    .filter((tool) => tool.id !== toolId)
    .sort((left, right) => {
      const leftMatches = left.category === currentTool.category ? 1 : 0;
      const rightMatches = right.category === currentTool.category ? 1 : 0;
      return rightMatches - leftMatches;
    })
    .slice(0, limit);
}
